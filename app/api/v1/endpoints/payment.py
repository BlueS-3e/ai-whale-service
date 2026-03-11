"""
Payment API Endpoints

Handles checkout, subscriptions, and payment webhooks.
"""

from fastapi import APIRouter, HTTPException, Request, Header, status
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field
from app.services.payment import payment_service, PaymentMethod
from app.core.pricing import PricingTier, get_tier_config, PRICING_TIERS
from app.core.logger import logger

router = APIRouter()


# Request/Response Models

class CheckoutRequest(BaseModel):
    """Create checkout session request."""
    email: EmailStr = Field(..., description="Customer email address")
    tier: PricingTier = Field(..., description="Pricing tier to subscribe to")
    billing_period: Literal["monthly", "yearly"] = Field(
        default="monthly",
        description="Billing period"
    )
    payment_method: PaymentMethod = Field(
        default=PaymentMethod.STRIPE_CARD,
        description="Payment method to use"
    )
    success_url: Optional[str] = Field(
        None,
        description="URL to redirect after successful payment"
    )
    cancel_url: Optional[str] = Field(
        None,
        description="URL to redirect if payment is cancelled"
    )


class CheckoutResponse(BaseModel):
    """Checkout session response."""
    session_id: str = Field(..., description="Payment session ID")
    payment_url: str = Field(..., description="URL to complete payment")
    amount_usd: float = Field(..., description="Amount in USD")
    tier: str = Field(..., description="Pricing tier")
    billing_period: str = Field(..., description="Billing period")
    payment_method: str = Field(..., description="Payment method")
    expires_at: str = Field(..., description="Session expiration time")


class PaymentVerificationResponse(BaseModel):
    """Payment verification response."""
    payment_id: str
    status: str
    amount_paid: Optional[float] = None
    currency: Optional[str] = None
    paid_at: Optional[str] = None
    error: Optional[str] = None


class PricingResponse(BaseModel):
    """Pricing tiers response."""
    tiers: dict
    payment_methods: list[str]
    crypto_discount: float


# Endpoints

@router.get("/pricing", response_model=PricingResponse)
async def get_pricing():
    """
    Get pricing tiers and payment methods.
    
    Returns all available pricing tiers with features and costs.
    """
    return {
        "tiers": PRICING_TIERS,
        "payment_methods": [method.value for method in PaymentMethod],
        "crypto_discount": 0.10,  # 10% discount for annual crypto payments
    }


@router.post("/checkout", response_model=CheckoutResponse, status_code=status.HTTP_201_CREATED)
async def create_checkout_session(request: CheckoutRequest):
    """
    Create a payment checkout session.
    
    Creates a checkout session with the selected payment provider
    (Stripe, INXY, PayRam, or Binance Pay).
    
    **Payment Methods:**
    - `stripe_card`: Credit/debit cards, Apple Pay, Google Pay
    - `stripe_crypto`: Crypto via Crypto.com (USDC, USDT)
    - `inxy`: Native crypto via INXY Paygate
    - `payram`: Native crypto via PayRam (self-hosted)
    - `binance_pay`: Binance Pay (45M+ users)
    
    **Crypto Benefits:**
    - 10% discount on annual plans
    - No chargebacks
    - Instant settlement
    - Multi-chain support
    """
    try:
        # Default URLs if not provided
        success_url = request.success_url or "https://dashboard.yourapp.com/success"
        cancel_url = request.cancel_url or "https://dashboard.yourapp.com/pricing"
        
        session = await payment_service.create_checkout_session(
            user_email=request.email,
            tier=request.tier,
            billing_period=request.billing_period,
            payment_method=request.payment_method,
            success_url=success_url,
            cancel_url=cancel_url,
        )
        
        return session
        
    except Exception as e:
        logger.error(f"Checkout session creation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create checkout session: {str(e)}"
        )


@router.get("/verify/{payment_id}", response_model=PaymentVerificationResponse)
async def verify_payment(
    payment_id: str,
    payment_method: PaymentMethod,
):
    """
    Verify payment status.
    
    Check if a payment has been completed successfully.
    Used after redirect from payment provider.
    """
    try:
        result = await payment_service.verify_payment(payment_id, payment_method)
        return result
        
    except Exception as e:
        logger.error(f"Payment verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to verify payment: {str(e)}"
        )


@router.post("/webhooks/stripe", status_code=status.HTTP_200_OK)
async def stripe_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None, alias="Stripe-Signature"),
):
    """
    Handle Stripe webhook events.
    
    Processes payment and subscription events from Stripe:
    - checkout.session.completed
    - payment_intent.succeeded
    - subscription.created/updated/deleted
    - invoice.payment_succeeded/failed
    """
    try:
        payload = await request.json()
        
        result = await payment_service.handle_webhook(
            provider="stripe",
            payload=payload,
            signature=stripe_signature,
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Stripe webhook processing failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Webhook processing failed: {str(e)}"
        )


@router.post("/webhooks/inxy", status_code=status.HTTP_200_OK)
async def inxy_webhook(
    request: Request,
    inxy_signature: Optional[str] = Header(None, alias="X-INXY-Signature"),
):
    """
    Handle INXY Paygate webhook events.
    
    Processes crypto payment events from INXY.
    """
    try:
        payload = await request.json()
        
        result = await payment_service.handle_webhook(
            provider="inxy",
            payload=payload,
            signature=inxy_signature,
        )
        
        return result
        
    except Exception as e:
        logger.error(f"INXY webhook processing failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Webhook processing failed: {str(e)}"
        )


@router.post("/webhooks/payram", status_code=status.HTTP_200_OK)
async def payram_webhook(request: Request):
    """
    Handle PayRam webhook events.
    
    Processes self-hosted crypto payment events.
    """
    try:
        payload = await request.json()
        
        result = await payment_service.handle_webhook(
            provider="payram",
            payload=payload,
        )
        
        return result
        
    except Exception as e:
        logger.error(f"PayRam webhook processing failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Webhook processing failed: {str(e)}"
        )


@router.post("/webhooks/binance", status_code=status.HTTP_200_OK)
async def binance_webhook(
    request: Request,
    binance_pay_signature: Optional[str] = Header(None, alias="BinancePay-Signature"),
):
    """
    Handle Binance Pay webhook events.
    
    Processes payment events from Binance Pay network.
    """
    try:
        payload = await request.json()
        
        result = await payment_service.handle_webhook(
            provider="binance",
            payload=payload,
            signature=binance_pay_signature,
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Binance webhook processing failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Webhook processing failed: {str(e)}"
        )


@router.get("/tier/{tier_name}")
async def get_tier_details(tier_name: str):
    """
    Get details for a specific pricing tier.
    
    Returns features, limits, and pricing for a tier.
    """
    try:
        tier = PricingTier(tier_name)
        config = get_tier_config(tier)
        return config
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pricing tier '{tier_name}' not found"
        )
