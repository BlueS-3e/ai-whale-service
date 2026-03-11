"""Billing service - track API usage and quotas."""
from typing import Optional, Dict
from datetime import datetime, timedelta
from app.core.logger import get_logger
from app.core.redis import get_redis
from app.core.pricing import (
    PricingTier,
    get_tier_config,
    get_endpoint_cost,
    calculate_overage_cost,
    should_allow_overage,
)

logger = get_logger(__name__)


class BillingService:
    """
    Service for tracking API usage and managing billing.

    Tracks:
    - API calls per key
    - Usage quotas
    - Rate limiting
    - Cost calculation
    """

    def __init__(self):
        """Initialize billing service."""
        pass

    async def record_usage(
        self,
        api_key: str,
        endpoint: str,
        cost_units: Optional[int] = None,
        response_time_ms: Optional[float] = None,
        status_code: int = 200,
    ) -> None:
        """
        Record API usage for billing.

        Args:
            api_key: API key used
            endpoint: Endpoint accessed
            cost_units: Cost in units (auto-calculated if None)
            response_time_ms: Response time in milliseconds
            status_code: HTTP status code
        """
        try:
            redis = await get_redis()

            # Calculate cost if not provided
            if cost_units is None:
                cost_units = get_endpoint_cost(endpoint)

            # Only count successful requests (2xx status codes) towards quota
            if 200 <= status_code < 300:
                # Get current month key
                now = datetime.utcnow()
                month_key = f"usage:month:{api_key}:{now.strftime('%Y%m')}"
                day_key = f"usage:day:{api_key}:{now.strftime('%Y%m%d')}"

                # Increment monthly usage
                await redis.hincrby(month_key, "total_calls", 1)
                await redis.hincrby(month_key, "total_units", cost_units)
                await redis.hincrby(month_key, f"endpoint:{endpoint}", 1)
                await redis.expire(month_key, 90 * 86400)  # Keep for 90 days

                # Increment daily usage
                await redis.hincrby(day_key, "total_calls", 1)
                await redis.hincrby(day_key, "total_units", cost_units)
                await redis.expire(day_key, 30 * 86400)  # Keep for 30 days

                # Store detailed log entry (for analytics)
                log_entry = {
                    "timestamp": now.isoformat(),
                    "endpoint": endpoint,
                    "cost_units": cost_units,
                    "response_time_ms": response_time_ms or 0,
                    "status_code": status_code,
                }

                # Add to sorted set for time-series queries (score = timestamp)
                log_key = f"usage:log:{api_key}"
                await redis.zadd(
                    log_key,
                    {str(log_entry): now.timestamp()}
                )
                # Keep logs for 90 days
                cutoff = (now - timedelta(days=90)).timestamp()
                await redis.zremrangebyscore(log_key, 0, cutoff)

                logger.debug(
                    f"Usage recorded: {api_key[:8]}... - {endpoint} - "
                    f"{cost_units} units - {status_code}"
                )
            else:
                # Still log errors (but don't count toward quota)
                logger.debug(
                    f"Error request logged (not counted): {api_key[:8]}... - "
                    f"{endpoint} - {status_code}"
                )

        except Exception as e:
            logger.error(f"Failed to record usage: {e}")

    async def check_quota(
        self,
        api_key: str,
        tier: PricingTier = PricingTier.DEMO,
        required_units: int = 1,
    ) -> tuple[bool, int, Dict]:
        """
        Check if API key has remaining quota.

        Args:
            api_key: API key to check
            tier: User's pricing tier
            required_units: Units required for the next request

        Returns:
            Tuple of (has_quota, remaining_units, usage_info)
        """
        try:
            redis = await get_redis()
            tier_config = get_tier_config(tier)
            monthly_limit = tier_config["monthly_calls"]

            # Get current usage
            now = datetime.utcnow()
            month_key = f"usage:month:{api_key}:{now.strftime('%Y%m')}"

            usage_data = await redis.hgetall(month_key)
            current_calls = int(usage_data.get("total_calls", 0))
            current_units = int(usage_data.get("total_units", 0))

            # Calculate remaining
            remaining_calls = monthly_limit - current_calls

            # Check if over quota
            if current_calls >= monthly_limit:
                # Check if tier allows overage
                if should_allow_overage(tier):
                    overage_cost = calculate_overage_cost(
                        current_calls - monthly_limit,
                        tier
                    )
                    logger.warning(
                        f"Quota exceeded (allowing overage): {api_key[:8]}... - "
                        f"{current_calls}/{monthly_limit} - Overage cost: ${overage_cost:.2f}"
                    )
                    return True, 0, {
                        "current_calls": current_calls,
                        "limit": monthly_limit,
                        "remaining": 0,
                        "overage": current_calls - monthly_limit,
                        "overage_cost_usd": overage_cost,
                        "in_overage": True,
                    }
                else:
                    # Demo tier - no overage allowed
                    logger.warning(
                        f"Quota hard limit reached: {api_key[:8]}... - "
                        f"{current_calls}/{monthly_limit}"
                    )
                    return False, 0, {
                        "current_calls": current_calls,
                        "limit": monthly_limit,
                        "remaining": 0,
                        "message": "Monthly quota exceeded. Upgrade to continue.",
                    }

            # Has quota
            return True, remaining_calls, {
                "current_calls": current_calls,
                "current_units": current_units,
                "limit": monthly_limit,
                "remaining": remaining_calls,
                "percentage_used": round((current_calls / monthly_limit) * 100, 2),
            }

        except Exception as e:
            logger.error(f"Failed to check quota: {e}")
            # Fail open in case of errors
            return True, 0, {"error": "Failed to check quota"}

    async def get_usage_stats(
        self,
        api_key: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> dict:
        """
        Get usage statistics for an API key.

        Args:
            api_key: API key
            start_date: Start date for stats (default: current month)
            end_date: End date for stats (default: now)

        Returns:
            Usage statistics
        """
        try:
            redis = await get_redis()
            now = datetime.utcnow()

            # Default to current month
            if not start_date:
                start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            if not end_date:
                end_date = now

            # Get monthly aggregates
            month_key = f"usage:month:{api_key}:{now.strftime('%Y%m')}"
            month_data = await redis.hgetall(month_key)

            total_calls = int(month_data.get("total_calls", 0))
            total_units = int(month_data.get("total_units", 0))

            # Get endpoint breakdown
            calls_by_endpoint = {}
            for key, value in month_data.items():
                if key.startswith("endpoint:"):
                    endpoint = key.replace("endpoint:", "")
                    calls_by_endpoint[endpoint] = int(value)

            # Get daily breakdown (last 30 days)
            daily_usage = []
            for i in range(30):
                day = now - timedelta(days=i)
                day_key = f"usage:day:{api_key}:{day.strftime('%Y%m%d')}"
                day_data = await redis.hgetall(day_key)

                if day_data:
                    daily_usage.append({
                        "date": day.strftime("%Y-%m-%d"),
                        "calls": int(day_data.get("total_calls", 0)),
                        "units": int(day_data.get("total_units", 0)),
                    })

            # Reverse to get chronological order
            daily_usage.reverse()

            return {
                "period": {
                    "start": start_date.isoformat(),
                    "end": end_date.isoformat(),
                },
                "total_calls": total_calls,
                "total_cost_units": total_units,
                "calls_by_endpoint": calls_by_endpoint,
                "daily_usage": daily_usage,
                "average_daily_calls": round(total_calls / max(1, len([d for d in daily_usage if d["calls"] > 0])), 2),
            }

        except Exception as e:
            logger.error(f"Failed to get usage stats: {e}")
            return {
                "error": "Failed to retrieve usage statistics"
            }

    async def reset_usage(self, api_key: str) -> bool:
        """
        Reset usage counters for an API key (admin only).

        Args:
            api_key: API key to reset

        Returns:
            True if successful
        """
        try:
            redis = await get_redis()
            now = datetime.utcnow()

            # Delete current month's data
            month_key = f"usage:month:{api_key}:{now.strftime('%Y%m')}"
            day_key = f"usage:day:{api_key}:{now.strftime('%Y%m%d')}"

            await redis.delete(month_key)
            await redis.delete(day_key)

            logger.info(f"Usage reset for API key: {api_key[:8]}...")
            return True

        except Exception as e:
            logger.error(f"Failed to reset usage: {e}")
            return False


# Singleton instance
billing_service = BillingService()
