"""Pricing tiers and endpoint cost configuration."""
from typing import Dict, Optional
from enum import Enum


class PricingTier(str, Enum):
    """Subscription pricing tiers."""
    DEMO = "demo"
    STARTER = "starter"
    GROWTH = "growth"
    ENTERPRISE = "enterprise"


# Pricing tier configurations
PRICING_TIERS = {
    PricingTier.DEMO: {
        "name": "Demo",
        "monthly_price": 0,
        "monthly_calls": 100,  # Very limited for demo
        "rate_limit_per_minute": 10,  # 10 calls/min
        "rate_limit_per_day": 100,  # 100 calls/day
        "features": ["whale_tracking_basic", "sentiment_basic"],
        "description": "Try our API with limited access",
    },
    PricingTier.STARTER: {
        "name": "Starter",
        "monthly_price": 49,
        "yearly_price": 470,  # ~20% discount (2 months free)
        "monthly_calls": 10_000,
        "rate_limit_per_minute": 60,
        "rate_limit_per_day": 2_000,
        "features": [
            "whale_tracking",
            "sentiment_basic",
            "historical_data_24h",
            "email_support",
        ],
        "description": "Perfect for individual developers and small projects",
    },
    PricingTier.GROWTH: {
        "name": "Growth",
        "monthly_price": 199,
        "yearly_price": 1_910,  # ~20% discount
        "monthly_calls": 100_000,
        "rate_limit_per_minute": 300,
        "rate_limit_per_day": 20_000,
        "features": [
            "whale_tracking",
            "sentiment_advanced",
            "risk_scoring",
            "historical_data_30d",
            "webhooks",
            "priority_support",
        ],
        "description": "For growing teams and production applications",
    },
    PricingTier.ENTERPRISE: {
        "name": "Enterprise",
        "monthly_price": 999,
        "yearly_price": 9_590,  # ~20% discount
        "monthly_calls": 1_000_000,
        "rate_limit_per_minute": 1000,
        "rate_limit_per_day": 200_000,
        "features": [
            "all_features",
            "custom_models",
            "dedicated_infrastructure",
            "unlimited_history",
            "webhooks",
            "custom_integrations",
            "sla_99_9",
            "dedicated_support",
            "on_premise_option",
        ],
        "description": "For large teams and enterprise deployments",
    },
}


# Cost per endpoint in "units" (different API calls cost different amounts)
# 1 unit = 1 basic API call
# Complex ML inference or predictions cost more units
ENDPOINT_COSTS = {
    # Whale endpoints
    "/api/v1/whale/track": 1,  # Basic whale tracking
    "/api/v1/whale/transactions": 2,  # Historical transactions
    "/api/v1/whale/predict": 10,  # AI prediction (expensive)
    "/api/v1/whale/top": 1,  # Top whales list
    
    # Sentiment endpoints
    "/api/v1/sentiment/analyze": 2,  # ML sentiment analysis
    "/api/v1/sentiment/trending": 1,  # Trending sentiment
    "/api/v1/sentiment/history": 3,  # Historical sentiment data
    
    # Risk endpoints
    "/api/v1/risk/assess": 3,  # Risk scoring
    "/api/v1/risk/portfolio": 5,  # Portfolio risk analysis (complex)
    
    # Blockchain data
    "/api/v1/blockchain/transactions": 2,  # On-chain data
    "/api/v1/blockchain/holders": 1,  # Token holders
    
    # Web3 auth (free)
    "/api/v1/auth/nonce": 0,  # Generate nonce
    "/api/v1/auth/verify": 0,  # Verify signature
}


def get_endpoint_cost(endpoint_path: str) -> int:
    """
    Get cost in units for a specific endpoint.
    
    Args:
        endpoint_path: API endpoint path
        
    Returns:
        Cost in units (defaults to 1 if endpoint not found)
    """
    # Exact match first
    if endpoint_path in ENDPOINT_COSTS:
        return ENDPOINT_COSTS[endpoint_path]
    
    # Try to match by prefix for dynamic routes
    for path_pattern, cost in ENDPOINT_COSTS.items():
        if endpoint_path.startswith(path_pattern.rstrip("/")):
            return cost
    
    # Default cost for unknown endpoints
    return 1


def get_tier_config(tier: PricingTier) -> Dict:
    """
    Get configuration for a pricing tier.
    
    Args:
        tier: Pricing tier enum
        
    Returns:
        Tier configuration dictionary
    """
    return PRICING_TIERS.get(tier, PRICING_TIERS[PricingTier.DEMO])


def calculate_overage_cost(calls_over_limit: int, tier: PricingTier) -> float:
    """
    Calculate overage cost for calls exceeding monthly quota.
    
    Args:
        calls_over_limit: Number of calls over monthly limit
        tier: User's pricing tier
        
    Returns:
        Overage cost in USD
    """
    # Overage pricing per 1000 calls
    overage_rates = {
        PricingTier.DEMO: 0,  # No overages allowed in demo
        PricingTier.STARTER: 10.0,  # $10 per 1000 calls
        PricingTier.GROWTH: 5.0,  # $5 per 1000 calls
        PricingTier.ENTERPRISE: 2.0,  # $2 per 1000 calls
    }
    
    rate = overage_rates.get(tier, 10.0)
    return (calls_over_limit / 1000) * rate


def should_allow_overage(tier: PricingTier) -> bool:
    """
    Check if tier allows overage (demo doesn't, paid tiers do).
    
    Args:
        tier: Pricing tier
        
    Returns:
        True if overage is allowed
    """
    return tier != PricingTier.DEMO


# Payment method configurations
PAYMENT_METHODS = {
    "stripe": {
        "enabled": True,
        "fee_percentage": 2.9,  # Stripe standard fee
        "fee_fixed": 0.30,  # Per transaction
        "supported_currencies": ["USD", "EUR", "GBP"],
    },
    "stripe_crypto": {
        "enabled": True,
        "fee_percentage": 1.5,  # Stripe crypto fee (via Crypto.com)
        "supported_currencies": ["USDC", "USDT"],
        "chains": ["ethereum", "polygon", "base"],
    },
    "native_crypto": {
        "enabled": True,
        "providers": {
            "inxy": {
                "enabled": True,
                "supported_tokens": ["USDC", "USDT", "ETH"],
                "chains": ["ethereum", "polygon", "base", "bsc"],
            },
            "payram": {
                "enabled": True,
                "supported_tokens": ["USDC", "USDT", "ETH", "BTC"],
                "chains": ["ethereum", "polygon", "base", "tron", "bitcoin"],
            },
            "binance_pay": {
                "enabled": True,
                "supported_tokens": ["USDT", "BUSD", "BNB"],
            },
        },
    },
}


# Discount for crypto payments (10% for annual)
CRYPTO_ANNUAL_DISCOUNT = 0.10  # 10% discount
