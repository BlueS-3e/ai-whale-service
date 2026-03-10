"""Whale prediction API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.whale import (
    WhalePredictionRequest,
    WhalePredictionResponse,
    WhaleHistoryRequest,
    WhaleHistoryResponse
)
from app.services.whale_service import WhaleService
from app.api.v1.deps import get_whale_service
from app.core.security import api_key_auth
from app.core.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/whale")


@router.post("/predict", response_model=WhalePredictionResponse)
async def predict_whale_movement(
    request: WhalePredictionRequest,
    service: WhaleService = Depends(get_whale_service),
    _: str = Depends(api_key_auth)
):
    """
    Predict whale movement probability for a given wallet and coin.
    
    Analyzes:
    - Historical transaction patterns
    - Wallet balance changes
    - Social sentiment
    - Market conditions
    
    Returns probability score (0-1) and confidence level.
    """
    try:
        logger.info(f"Whale prediction request: {request.wallet_address} - {request.coin_symbol}")
        result = await service.predict(request.wallet_address, request.coin_symbol)
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Insufficient data for prediction"
            )
        
        return result
    
    except Exception as e:
        logger.error(f"Whale prediction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )


@router.post("/history", response_model=WhaleHistoryResponse)
async def get_whale_history(
    request: WhaleHistoryRequest,
    service: WhaleService = Depends(get_whale_service),
    _: str = Depends(api_key_auth)
):
    """
    Get historical whale transaction data for a wallet.
    
    Returns:
    - Transaction history
    - Volume patterns
    - Notable movements
    """
    try:
        logger.info(f"Whale history request: {request.wallet_address}")
        history = await service.get_history(
            request.wallet_address,
            request.limit,
            request.offset
        )
        
        return history
    
    except Exception as e:
        logger.error(f"Whale history error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch history: {str(e)}"
        )


@router.get("/top-whales")
async def get_top_whales(
    coin_symbol: str,
    limit: int = 10,
    service: WhaleService = Depends(get_whale_service),
    _: str = Depends(api_key_auth)
):
    """
    Get top whale wallets for a specific coin.
    
    Returns list of largest holders and their activity scores.
    """
    try:
        whales = await service.get_top_whales(coin_symbol, limit)
        return {"coin": coin_symbol, "whales": whales}
    
    except Exception as e:
        logger.error(f"Top whales error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch top whales: {str(e)}"
        )
