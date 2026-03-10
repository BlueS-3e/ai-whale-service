"""Risk assessment API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.risk import (
    RiskAssessmentRequest,
    RiskAssessmentResponse,
    PortfolioRiskRequest,
    PortfolioRiskResponse
)
from app.services.risk_service import RiskService
from app.api.v1.deps import get_risk_service
from app.core.security import api_key_auth
from app.core.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/risk")


@router.post("/assess", response_model=RiskAssessmentResponse)
async def assess_risk(
    request: RiskAssessmentRequest,
    service: RiskService = Depends(get_risk_service),
    _: str = Depends(api_key_auth)
):
    """
    Assess risk for a specific coin or token.

    Analyzes:
    - Smart contract vulnerabilities
    - Liquidity risks
    - Volatility metrics
    - Whale concentration
    - Social sentiment

    Returns comprehensive risk score (0-100) and breakdown.
    """
    try:
        logger.info(f"Risk assessment request: {request.coin_symbol}")
        result = await service.assess(request.coin_symbol, request.chain)

        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Insufficient data for risk assessment"
            )

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Risk assessment error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Assessment failed: {str(e)}"
        )


@router.post("/portfolio", response_model=PortfolioRiskResponse)
async def assess_portfolio_risk(
    request: PortfolioRiskRequest,
    service: RiskService = Depends(get_risk_service),
    _: str = Depends(api_key_auth)
):
    """
    Assess risk for an entire portfolio of holdings.

    Analyzes:
    - Portfolio diversification
    - Correlated risks
    - Overall exposure
    - Suggested rebalancing

    Returns portfolio-level risk metrics.
    """
    try:
        logger.info(f"Portfolio risk assessment: {len(request.holdings)} holdings")
        result = await service.assess_portfolio(request.holdings)

        return result

    except Exception as e:
        logger.error(f"Portfolio risk error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Portfolio assessment failed: {str(e)}"
        )


@router.get("/market-risk")
async def get_market_risk(
    service: RiskService = Depends(get_risk_service),
    _: str = Depends(api_key_auth)
):
    """
    Get overall crypto market risk indicators.

    Returns:
    - Fear & Greed index
    - Market volatility
    - Systemic risks
    """
    try:
        market_risk = await service.get_market_risk()
        return market_risk

    except Exception as e:
        logger.error(f"Market risk error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch market risk: {str(e)}"
        )
