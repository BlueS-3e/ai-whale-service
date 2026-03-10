"""Health check endpoint."""
from fastapi import APIRouter, status
from datetime import datetime
from app.core.config import settings

router = APIRouter()


@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Health check endpoint - no authentication required.

    Returns service status and basic information.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/health/ready", status_code=status.HTTP_200_OK)
async def readiness_check():
    """
    Readiness check - verify external dependencies.

    Checks:
    - Database connectivity
    - Redis connectivity
    - Model availability
    """
    # TODO: Implement actual checks
    checks = {
        "database": "ok",  # Check DB connection
        "redis": "ok",     # Check Redis connection
        "models": "ok"     # Check models are loaded
    }

    all_ok = all(v == "ok" for v in checks.values())

    return {
        "ready": all_ok,
        "checks": checks,
        "timestamp": datetime.utcnow().isoformat()
    }
