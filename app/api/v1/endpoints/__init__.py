"""Endpoints package."""
from app.api.v1.endpoints import health, whale, sentiment, risk, payment

# Optional web3 endpoint (requires web3 dependencies)
try:
    from app.api.v1.endpoints import web3  # noqa: F401
    __all__ = ["health", "whale", "sentiment", "risk", "payment", "web3"]
except ImportError:
    __all__ = ["health", "whale", "sentiment", "risk", "payment"]
