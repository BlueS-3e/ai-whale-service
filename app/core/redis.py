"""Redis client configuration and connection management."""
import redis.asyncio as aioredis
from redis.asyncio import Redis
from typing import Optional
from app.core.config import settings
from app.core.logger import logger

# Global Redis client
_redis_client: Optional[Redis] = None


async def get_redis() -> Redis:
    """
    Get or create Redis client connection.
    
    Returns:
        Redis: Async Redis client instance
    """
    global _redis_client
    
    if _redis_client is None:
        try:
            _redis_client = await aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                max_connections=10
            )
            # Test connection
            await _redis_client.ping()
            logger.info("Redis connection established")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            raise
    
    return _redis_client


async def close_redis() -> None:
    """Close Redis connection."""
    global _redis_client
    
    if _redis_client:
        await _redis_client.close()
        _redis_client = None
        logger.info("Redis connection closed")


class RedisCache:
    """Redis cache utility class."""
    
    def __init__(self, redis_client: Redis):
        self.redis = redis_client
    
    async def get(self, key: str) -> Optional[str]:
        """Get value from cache."""
        try:
            return await self.redis.get(key)
        except Exception as e:
            logger.error(f"Redis GET error: {e}")
            return None
    
    async def set(self, key: str, value: str, ttl: int = None) -> bool:
        """
        Set value in cache.
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time to live in seconds (default from settings)
        """
        try:
            ttl = ttl or settings.REDIS_CACHE_TTL
            await self.redis.set(key, value, ex=ttl)
            return True
        except Exception as e:
            logger.error(f"Redis SET error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache."""
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.error(f"Redis DELETE error: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in cache."""
        try:
            return await self.redis.exists(key) > 0
        except Exception as e:
            logger.error(f"Redis EXISTS error: {e}")
            return False


async def get_cache() -> RedisCache:
    """Dependency to get Redis cache instance."""
    redis_client = await get_redis()
    return RedisCache(redis_client)
