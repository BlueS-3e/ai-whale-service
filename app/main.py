"""Main FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logger import logger
from app.api.v1 import endpoints

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="BNB Whale AI - AI-powered whale movement prediction for the BNB ecosystem",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(endpoints.health.router, prefix="/v1", tags=["health"])
app.include_router(endpoints.whale.router, prefix="/v1", tags=["whale"])
app.include_router(endpoints.sentiment.router, prefix="/v1", tags=["sentiment"])
app.include_router(endpoints.risk.router, prefix="/v1", tags=["risk"])
app.include_router(endpoints.payment.router, prefix="/v1/payment", tags=["payment"])

# Include web3 router if available
if hasattr(endpoints, "web3"):
    app.include_router(endpoints.web3.router, prefix="/v1/web3", tags=["web3"])
    logger.info("Web3 endpoints enabled")
else:
    logger.warning("Web3 endpoints disabled (web3 dependencies not installed)")


@app.on_event("startup")
async def startup_event():
    """Actions to perform on application startup."""
    logger.info(f"Starting {settings.PROJECT_NAME}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    # TODO: Initialize database connections
    # TODO: Load AI models into memory
    # TODO: Initialize Redis connection


@app.on_event("shutdown")
async def shutdown_event():
    """Actions to perform on application shutdown."""
    logger.info(f"Shutting down {settings.PROJECT_NAME}")
    # TODO: Close database connections
    # TODO: Close Redis connection


@app.get("/")
async def root():
    """Root endpoint - API information."""
    return {
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        workers=settings.WORKERS
    )
