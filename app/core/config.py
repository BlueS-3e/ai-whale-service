"""Application configuration using Pydantic Settings."""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Project Info
    PROJECT_NAME: str = "AI Whale Service"
    ENVIRONMENT: str = "development"

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    RELOAD: bool = True

    # Database
    DATABASE_URL: str = "postgresql://user:pass@localhost:5432/aiwhale"
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL: int = 3600  # 1 hour in seconds

    # Security
    API_KEY_HEADER: str = "X-API-Key"
    MASTER_API_KEY: str = "supersecretkey"
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"

    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    # Model Configuration
    MODEL_PATH: str = "./models/"
    MODEL_CACHE_SIZE: int = 3  # Number of models to keep in memory

    # External APIs
    TWITTER_BEARER_TOKEN: str | None = None
    ETHERSCAN_API_KEY: str | None = None
    OPENSEA_API_KEY: str | None = None
    OPENAI_API_KEY: str | None = None

    # Blockchain RPC Endpoints
    ETHEREUM_RPC_URL: str = "https://eth-mainnet.g.alchemy.com/v2/your-key"
    POLYGON_RPC_URL: str = "https://polygon-mainnet.g.alchemy.com/v2/your-key"
    BSC_RPC_URL: str = "https://bsc-dataseed.binance.org/"

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    # Celery (Background Tasks)
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    # Feature Flags
    ENABLE_MODEL_CACHING: bool = True
    ENABLE_SOCIAL_SCRAPING: bool = True
    ENABLE_ONCHAIN_ANALYSIS: bool = True

    class Config:
        """Pydantic configuration."""
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
