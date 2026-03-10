"""Endpoints package."""
from app.api.v1.endpoints import health, whale, sentiment, risk

# Optional web3 endpoint (requires web3 dependencies)
try:
    from app.api.v1.endpoints import web3
    __all__ = ["health", "whale", "sentiment", "risk", "web3"]
except ImportError:
    __all__ = ["health", "whale", "sentiment", "risk"]
