"""Payment processing service - Stripe and crypto."""
from typing import Optional, Dict, Literal
from datetime import datetime, timedelta
from enum import Enum
import secrets
from app.core.logger import get_logger
from app.core.pricing import (
    PricingTier,
    get_tier_config,
    CRYPTO_ANNUAL_DISCOUNT,
    PAYMENT_METHODS,
)

logger = get_logger(__name__)


class PaymentMethod(str, Enum):
    """Supported payment methods."""
    STRIPE_CARD = "stripe_card"
    STRIPE_CRYPTO = "stripe_crypto"  # Crypto.com via Stripe
    INXY = "inxy"  # Native crypto via INXY
    PAYRAM = "payram"  # Native crypto via PayRam
    BINANCE_PAY = "binance_pay"  # Binance Pay


class PaymentStatus(str, Enum):
    """Payment status."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    EXPIRED = "expired"


class SubscriptionStatus(str, Enum):
    """Subscription status."""
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    TRIALING = "trialing"
    INCOMPLETE = "incomplete"


class PaymentService:
    """
    Service for processing payments via Stripe and crypto.
    
    Supports:
    - Stripe (cards, Apple Pay, Google Pay)
    - Stripe Crypto (via Crypto.com integration)
    - Native crypto (INXY, PayRam, Binance Pay)
    """
    
    def __init__(self):
        """Initialize payment service."""
        # TODO: Initialize payment provider clients
        # - Stripe SDK (stripe.api_key = settings.STRIPE_SECRET_KEY)
        # - INXY API client
        # - PayRam SDK
        # - Binance Pay SDK
        pass
    
    async def create_checkout_session(
        self,
        user_email: str,
        tier: PricingTier,
        billing_period: Literal["monthly", "yearly"] = "monthly",
        payment_method: PaymentMethod = PaymentMethod.STRIPE_CARD,
        success_url: str = None,
        cancel_url: str = None,
    ) -> Dict:
        """
        Create a payment checkout session.
        
        Args:
            user_email: Customer email
            tier: Pricing tier to subscribe to
            billing_period: Monthly or yearly billing
            payment_method: Payment method to use
            success_url: URL to redirect after successful payment
            cancel_url: URL to redirect if payment is cancelled
            
        Returns:
            Checkout session details with payment URL
        """
        try:
            tier_config = get_tier_config(tier)
            
            # Calculate amount
            if billing_period == "yearly":
                amount_key = "yearly_price"
            else:
                amount_key = "monthly_price"
            
            amount_usd = tier_config.get(amount_key, tier_config["monthly_price"])
            
            # Apply crypto discount for yearly plans
            if billing_period == "yearly" and payment_method != PaymentMethod.STRIPE_CARD:
                discount_amount = amount_usd * CRYPTO_ANNUAL_DISCOUNT
                amount_usd = amount_usd - discount_amount
                logger.info(f"Applied {CRYPTO_ANNUAL_DISCOUNT*100}% crypto discount: ${discount_amount:.2f}")
            
            # Route to appropriate payment processor
            if payment_method == PaymentMethod.STRIPE_CARD:
                return await self._create_stripe_session(
                    user_email, tier, billing_period, amount_usd,
                    success_url, cancel_url
                )
            elif payment_method == PaymentMethod.STRIPE_CRYPTO:
                return await self._create_stripe_crypto_session(
                    user_email, tier, billing_period, amount_usd,
                    success_url, cancel_url
                )
            elif payment_method == PaymentMethod.INXY:
                return await self._create_inxy_payment(
                    user_email, tier, billing_period, amount_usd
                )
            elif payment_method == PaymentMethod.PAYRAM:
                return await self._create_payram_payment(
                    user_email, tier, billing_period, amount_usd
                )
            elif payment_method == PaymentMethod.BINANCE_PAY:
                return await self._create_binance_payment(
                    user_email, tier, billing_period, amount_usd
                )
            
        except Exception as e:
            logger.error(f"Failed to create checkout session: {e}")
            raise
    
    async def _create_stripe_session(
        self,
        user_email: str,
        tier: PricingTier,
        billing_period: str,
        amount_usd: float,
        success_url: str,
        cancel_url: str,
    ) -> Dict:
        """Create Stripe Checkout session for card payments."""
        try:
            # TODO: Implement with Stripe SDK
            # import stripe
            # stripe.api_key = settings.STRIPE_SECRET_KEY
            #
            # session = stripe.checkout.Session.create(
            #     customer_email=user_email,
            #     mode='subscription',
            #     line_items=[{
            #         'price_data': {
            #             'currency': 'usd',
            #             'product_data': {
            #                 'name': f'AI Whale Service - {tier.value.title()}',
            #                 'description': tier_config['description'],
            #             },
            #             'unit_amount': int(amount_usd * 100),  # in cents
            #             'recurring': {
            #                 'interval': 'month' if billing_period == 'monthly' else 'year'
            #             },
            #         },
            #         'quantity': 1,
            #     }],
            #     success_url=success_url,
            #     cancel_url=cancel_url,
            #     metadata={
            #         'tier': tier.value,
            #         'billing_period': billing_period,
            #     }
            # )
            
            # Mock response for now
            session_id = f"cs_test_{secrets.token_urlsafe(32)}"
            
            return {
                "session_id": session_id,
                "payment_url": f"https://checkout.stripe.com/pay/{session_id}",
                "amount_usd": amount_usd,
                "currency": "USD",
                "tier": tier.value,
                "billing_period": billing_period,
                "payment_method": PaymentMethod.STRIPE_CARD.value,
                "expires_at": (datetime.utcnow() + timedelta(hours=24)).isoformat(),
            }
            
        except Exception as e:
            logger.error(f"Stripe session creation failed: {e}")
            raise
    
    async def _create_stripe_crypto_session(
        self,
        user_email: str,
        tier: PricingTier,
        billing_period: str,
        amount_usd: float,
        success_url: str,
        cancel_url: str,
    ) -> Dict:
        """Create Stripe Checkout session with Crypto.com payment enabled."""
        try:
            # TODO: Same as Stripe card, but with crypto payment method enabled
            # session = stripe.checkout.Session.create(
            #     ...
            #     payment_method_types=['card', 'crypto'],  # Enable crypto via Crypto.com
            #     ...
            # )
            
            session_id = f"cs_crypto_{secrets.token_urlsafe(32)}"
            
            return {
                "session_id": session_id,
                "payment_url": f"https://checkout.stripe.com/pay/{session_id}",
                "amount_usd": amount_usd,
                "currency": "USD",
                "crypto_enabled": True,
                "supported_tokens": ["USDC", "USDT"],
                "tier": tier.value,
                "billing_period": billing_period,
                "payment_method": PaymentMethod.STRIPE_CRYPTO.value,
                "expires_at": (datetime.utcnow() + timedelta(hours=24)).isoformat(),
            }
            
        except Exception as e:
            logger.error(f"Stripe crypto session creation failed: {e}")
            raise
    
    async def _create_inxy_payment(
        self,
        user_email: str,
        tier: PricingTier,
        billing_period: str,
        amount_usd: float,
    ) -> Dict:
        """Create payment via INXY Paygate."""
        try:
            # TODO: Implement INXY API integration
            # Headers: Authorization: Bearer {api_key}
            # POST /api/v1/payments/create
            # {
            #   "amount": amount_usd,
            #   "currency": "USD",
            #   "description": f"AI Whale Service - {tier}",
            #   "customer_email": user_email,
            #   "success_url": success_url,
            #   "cancel_url": cancel_url,
            #   "auto_convert": true,  # Convert crypto to fiat
            #   "accepted_tokens": ["USDC", "USDT", "ETH"]
            # }
            
            payment_id = f"inxy_{secrets.token_urlsafe(24)}"
            
            return {
                "payment_id": payment_id,
                "payment_url": f"https://paygate.inxy.com/pay/{payment_id}",
                "amount_usd": amount_usd,
                "accepted_tokens": ["USDC", "USDT", "ETH"],
                "chains": ["ethereum", "polygon", "base", "bsc"],
                "tier": tier.value,
                "billing_period": billing_period,
                "payment_method": PaymentMethod.INXY.value,
                "expires_at": (datetime.utcnow() + timedelta(hours=2)).isoformat(),
            }
            
        except Exception as e:
            logger.error(f"INXY payment creation failed: {e}")
            raise
    
    async def _create_payram_payment(
        self,
        user_email: str,
        tier: PricingTier,
        billing_period: str,
        amount_usd: float,
    ) -> Dict:
        """Create payment via PayRam (self-hosted crypto gateway)."""
        try:
            # TODO: Implement PayRam integration
            # PayRam is self-hosted, so we control the URLs
            # No KYC required for customers
            
            payment_id = f"payram_{secrets.token_urlsafe(24)}"
            
            return {
                "payment_id": payment_id,
                "payment_url": f"https://payments.yourapp.com/crypto/{payment_id}",
                "amount_usd": amount_usd,
                "accepted_tokens": ["USDC", "USDT", "ETH", "BTC"],
                "chains": ["ethereum", "polygon", "base", "tron", "bitcoin"],
                "tier": tier.value,
                "billing_period": billing_period,
                "payment_method": PaymentMethod.PAYRAM.value,
                "no_kyc": True,
                "expires_at": (datetime.utcnow() + timedelta(hours=2)).isoformat(),
            }
            
        except Exception as e:
            logger.error(f"PayRam payment creation failed: {e}")
            raise
    
    async def _create_binance_payment(
        self,
        user_email: str,
        tier: PricingTier,
        billing_period: str,
        amount_usd: float,
    ) -> Dict:
        """Create payment via Binance Pay."""
        try:
            # TODO: Implement Binance Pay API integration
            # POST https://bpay.binanceapi.com/binancepay/openapi/v2/order
            # Headers:
            #   BinancePay-Timestamp: timestamp
            #   BinancePay-Nonce: nonce
            #   BinancePay-Certificate-SN: certificate_sn
            #   BinancePay-Signature: signature
            # Body:
            # {
            #   "env": {
            #     "terminalType": "WEB"
            #   },
            #   "merchantTradeNo": payment_id,
            #   "orderAmount": amount_usd,
            #   "currency": "USDT",
            #   "goods": {
            #     "goodsType": "02",  # Virtual goods
            #     "goodsCategory": "Z000",  # Services
            #     "referenceGoodsId": tier,
            #     "goodsName": f"AI Whale Service - {tier}"
            #   },
            #   "returnUrl": success_url,
            #   "cancelUrl": cancel_url
            # }
            
            payment_id = f"bnpay_{secrets.token_urlsafe(24)}"
            
            return {
                "payment_id": payment_id,
                "payment_url": f"https://pay.binance.com/checkout/{payment_id}",
                "amount_usd": amount_usd,
                "currency": "USDT",  # Binance Pay uses USDT by default
                "tier": tier.value,
                "billing_period": billing_period,
                "payment_method": PaymentMethod.BINANCE_PAY.value,
                "merchant_network": "45M+ users",
                "expires_at": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            }
            
        except Exception as e:
            logger.error(f"Binance Pay payment creation failed: {e}")
            raise
    
    async def verify_payment(
        self,
        payment_id: str,
        payment_method: PaymentMethod,
    ) -> Dict:
        """
        Verify payment status.
        
        Args:
            payment_id: Payment/session ID
            payment_method: Payment method used
            
        Returns:
            Payment verification details
        """
        try:
            # TODO: Query payment provider
            # - Stripe: stripe.checkout.Session.retrieve(payment_id)
            # - INXY: GET /api/v1/payments/{payment_id}
            # - PayRam: Query local database
            # - Binance Pay: GET /binancepay/openapi/v2/order/query
            
            # Mock response
            return {
                "payment_id": payment_id,
                "status": PaymentStatus.COMPLETED.value,
                "amount_paid": 49.00,
                "currency": "USD",
                "paid_at": datetime.utcnow().isoformat(),
            }
            
        except Exception as e:
            logger.error(f"Payment verification failed: {e}")
            return {
                "payment_id": payment_id,
                "status": PaymentStatus.FAILED.value,
                "error": str(e),
            }
    
    async def handle_webhook(
        self,
        provider: str,
        payload: Dict,
        signature: Optional[str] = None,
    ) -> Dict:
        """
        Handle webhook from payment provider.
        
        Args:
            provider: Payment provider (stripe, inxy, payram, binance)
            payload: Webhook payload
            signature: Webhook signature for verification
            
        Returns:
            Processed webhook result
        """
        try:
            logger.info(f"Processing webhook from {provider}")
            
            # Verify signature
            if provider == "stripe":
                # TODO: Verify Stripe signature
                # stripe.Webhook.construct_event(payload, signature, webhook_secret)
                pass
            elif provider == "inxy":
                # TODO: Verify INXY signature
                pass
            elif provider == "binance":
                # TODO: Verify Binance Pay signature
                pass
            
            # Process event
            event_type = payload.get("type") or payload.get("event")
            
            if event_type in ["payment.succeeded", "checkout.session.completed"]:
                return await self._handle_payment_success(payload)
            elif event_type in ["payment.failed", "checkout.session.expired"]:
                return await self._handle_payment_failure(payload)
            elif event_type in ["subscription.updated", "subscription.canceled"]:
                return await self._handle_subscription_update(payload)
            
            return {"status": "processed", "event_type": event_type}
            
        except Exception as e:
            logger.error(f"Webhook processing failed: {e}")
            raise
    
    async def _handle_payment_success(self, payload: Dict) -> Dict:
        """Handle successful payment webhook."""
        try:
            # TODO: Extract payment details from payload
            # - customer_email
            # - amount_paid
            # - tier from metadata
            # - Create/upgrade subscription in database
            # - Generate API key
            # - Send welcome email
            
            logger.info(f"Payment succeeded: {payload}")
            return {"status": "success"}
            
        except Exception as e:
            logger.error(f"Payment success handling failed: {e}")
            raise
    
    async def _handle_payment_failure(self, payload: Dict) -> Dict:
        """Handle failed payment webhook."""
        try:
            logger.warning(f"Payment failed: {payload}")
            # TODO: Update subscription status, send notification
            return {"status": "failed"}
            
        except Exception as e:
            logger.error(f"Payment failure handling failed: {e}")
            raise
    
    async def _handle_subscription_update(self, payload: Dict) -> Dict:
        """Handle subscription update webhook."""
        try:
            logger.info(f"Subscription updated: {payload}")
            # TODO: Update subscription details in database
            return {"status": "updated"}
            
        except Exception as e:
            logger.error(f"Subscription update handling failed: {e}")
            raise


# Singleton instance
payment_service = PaymentService()
