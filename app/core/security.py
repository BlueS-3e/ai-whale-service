"""Security utilities - API key authentication."""
from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader
from typing import Optional
from datetime import datetime, timedelta
from app.core.config import settings
from app.core.logger import logger
from app.core.redis import get_redis
from app.core.pricing import PricingTier, get_tier_config

# API Key header scheme
api_key_header = APIKeyHeader(name=settings.API_KEY_HEADER, auto_error=False)


async def validate_api_key(api_key: Optional[str] = Security(api_key_header)) -> str:
    """
    Validate API key from request header.

    Args:
        api_key: API key from header

    Returns:
        str: Validated API key

    Raises:
        HTTPException: If API key is invalid or missing
    """
    if not api_key:
        logger.warning("API key missing from request")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key is missing",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    # TODO: Implement proper API key validation against database
    # For now, simple comparison with master key
    # In production, query database for valid API keys and check rate limits

    if api_key != settings.MASTER_API_KEY:
        logger.warning(f"Invalid API key attempted: {api_key[:8]}...")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key",
        )

    logger.debug(f"Valid API key authenticated: {api_key[:8]}...")
    return api_key


async def check_rate_limit(api_key: str, tier: PricingTier = PricingTier.DEMO) -> None:
    """
    Check if API key has exceeded rate limit using Redis.

    Implements sliding window rate limiting:
    - Per-minute limit (short burst protection)
    - Per-day limit (quota management)

    Args:
        api_key: Validated API key
        tier: User's pricing tier

    Raises:
        HTTPException: If rate limit exceeded
    """
    try:
        redis = await get_redis()
        tier_config = get_tier_config(tier)

        # Get rate limits from tier
        limit_per_minute = tier_config["rate_limit_per_minute"]
        limit_per_day = tier_config["rate_limit_per_day"]

        now = datetime.utcnow()

        # Check per-minute limit (sliding window)
        minute_key = f"rate_limit:minute:{api_key}:{now.strftime('%Y%m%d%H%M')}"
        minute_count = await redis.incr(minute_key)

        if minute_count == 1:
            # First request in this minute, set expiry
            await redis.expire(minute_key, 60)

        if minute_count > limit_per_minute:
            logger.warning(f"Rate limit exceeded (per-minute): {api_key[:8]}... - {minute_count}/{limit_per_minute}")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded: {limit_per_minute} requests per minute",
                headers={
                    "X-RateLimit-Limit": str(limit_per_minute),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int((now + timedelta(minutes=1)).timestamp())),
                    "Retry-After": "60",
                },
            )

        # Check per-day limit
        day_key = f"rate_limit:day:{api_key}:{now.strftime('%Y%m%d')}"
        day_count = await redis.incr(day_key)

        if day_count == 1:
            # First request today, set expiry for 24 hours
            await redis.expire(day_key, 86400)

        if day_count > limit_per_day:
            logger.warning(f"Rate limit exceeded (per-day): {api_key[:8]}... - {day_count}/{limit_per_day}")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Daily quota exceeded: {limit_per_day} requests per day",
                headers={
                    "X-RateLimit-Limit": str(limit_per_day),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int((now + timedelta(days=1)).timestamp())),
                },
            )

        # Log successful rate limit check
        logger.debug(
            f"Rate limit OK: {api_key[:8]}... - "
            f"{minute_count}/{limit_per_minute} per min, "
            f"{day_count}/{limit_per_day} per day"
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log error but don't block request if Redis is down (fail open)
        logger.error(f"Rate limit check failed: {e}")
        # In production, you might want to fail closed (block request) for security


async def get_rate_limit_info(api_key: str, tier: PricingTier = PricingTier.DEMO) -> dict:
    """
    Get current rate limit status for an API key.

    Args:
        api_key: API key to check
        tier: User's pricing tier

    Returns:
        Dictionary with rate limit information
    """
    try:
        redis = await get_redis()
        tier_config = get_tier_config(tier)
        now = datetime.utcnow()

        # Get counts
        minute_key = f"rate_limit:minute:{api_key}:{now.strftime('%Y%m%d%H%M')}"
        day_key = f"rate_limit:day:{api_key}:{now.strftime('%Y%m%d')}"

        minute_count = int(await redis.get(minute_key) or 0)
        day_count = int(await redis.get(day_key) or 0)

        limit_per_minute = tier_config["rate_limit_per_minute"]
        limit_per_day = tier_config["rate_limit_per_day"]

        return {
            "tier": tier.value,
            "limits": {
                "per_minute": limit_per_minute,
                "per_day": limit_per_day,
            },
            "usage": {
                "per_minute": minute_count,
                "per_day": day_count,
            },
            "remaining": {
                "per_minute": max(0, limit_per_minute - minute_count),
                "per_day": max(0, limit_per_day - day_count),
            },
            "reset_times": {
                "minute": int((now + timedelta(minutes=1)).timestamp()),
                "day": int((now + timedelta(days=1)).timestamp()),
            },
        }
    except Exception as e:
        logger.error(f"Failed to get rate limit info: {e}")
        return {
            "tier": tier.value,
            "error": "Failed to retrieve rate limit information",
        }


# Dependency for endpoints requiring authentication
async def api_key_auth(api_key: str = Security(validate_api_key)) -> str:
    """
    Dependency to validate API key and check rate limits.

    Usage:
        @router.get("/protected")
        async def protected_route(_: str = Depends(api_key_auth)):
            return {"message": "Access granted"}
    """
    # TODO: In production, fetch user's tier from database
    # For now, default to DEMO tier
    tier = PricingTier.DEMO
    await check_rate_limit(api_key, tier)
    return api_key


# TODO: Implement additional security features:
# - JWT tokens for user authentication
# - OAuth2 integration
# - IP whitelisting
# - Request signing
# - Webhook signature verification
