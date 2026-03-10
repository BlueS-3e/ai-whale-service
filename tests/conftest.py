"""Pytest configuration and fixtures."""
import pytest
import asyncio
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.core.config import settings


# Test database URL (use SQLite for tests)
TEST_DATABASE_URL = "sqlite:///./test.db"

# Create test engine
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create test session factory
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
def db() -> Generator:
    """Create test database."""
    Base.metadata.create_all(bind=test_engine)
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(db) -> Generator:
    """Create test client."""
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def api_key() -> str:
    """Get valid API key for testing."""
    return settings.MASTER_API_KEY


@pytest.fixture
def api_headers(api_key: str) -> dict:
    """Get headers with API key."""
    return {settings.API_KEY_HEADER: api_key}


@pytest.fixture
def mock_whale_data():
    """Mock whale data for testing."""
    return {
        "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        "coin_symbol": "ETH",
        "timeframe": "24h"
    }


@pytest.fixture
def mock_sentiment_data():
    """Mock sentiment data for testing."""
    return {
        "text": "Bitcoin is looking very bullish today! 🚀",
        "coin_symbol": "BTC"
    }


@pytest.fixture
def mock_risk_data():
    """Mock risk assessment data for testing."""
    return {
        "coin_symbol": "SHIB",
        "chain": "ethereum"
    }
