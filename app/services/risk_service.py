"""Risk service - business logic for risk assessment."""
from typing import Dict, List, Optional
from app.models.risk_scorer import RiskScorer
from app.services.blockchain import BlockchainService
from app.core.logger import get_logger

logger = get_logger(__name__)


class RiskService:
    """
    Service layer for risk assessment.

    Orchestrates:
    - Multi-source data collection
    - Risk metric calculation
    - Model scoring
    - Recommendation generation
    """

    def __init__(self, model: RiskScorer):
        """Initialize risk service."""
        self.model = model
        self.blockchain_service = BlockchainService()

    async def assess(
        self,
        coin_symbol: str,
        chain: Optional[str] = None
    ) -> Optional[Dict]:
        """
        Assess risk for a cryptocurrency.

        Args:
            coin_symbol: Cryptocurrency symbol
            chain: Blockchain network

        Returns:
            Risk assessment results
        """
        try:
            logger.info(f"Assessing risk for: {coin_symbol}")

            # Gather risk metrics from various sources
            metrics = await self._gather_risk_metrics(coin_symbol, chain)

            if not metrics:
                logger.warning(f"Insufficient data for risk assessment: {coin_symbol}")
                return None

            # Get risk assessment from model
            risk_result = self.model.predict(metrics)

            # Add coin symbol
            risk_result["coin_symbol"] = coin_symbol

            return risk_result

        except Exception as e:
            logger.error(f"Risk assessment failed: {e}")
            raise

    async def assess_portfolio(self, holdings: List[Dict]) -> Dict:
        """
        Assess risk for an entire portfolio.

        Args:
            holdings: List of portfolio holdings

        Returns:
            Portfolio risk assessment
        """
        try:
            logger.info(f"Assessing portfolio risk: {len(holdings)} holdings")

            # Assess individual holdings
            individual_risks = []
            total_value = sum(h["current_value_usd"] for h in holdings)

            for holding in holdings:
                risk = await self.assess(holding["coin_symbol"])
                if risk:
                    individual_risks.append({
                        "coin_symbol": holding["coin_symbol"],
                        "allocation_percentage": holding["allocation_percentage"],
                        "risk_score": risk["overall_risk_score"],
                        "risk_level": risk["risk_level"]
                    })

            # Calculate weighted risk score
            weighted_risk = sum(
                r["risk_score"] * r["allocation_percentage"] / 100
                for r in individual_risks
            )

            # Calculate diversification score
            diversification_score = self._calculate_diversification(holdings)

            # Calculate correlation matrix (simplified)
            correlation_matrix = self._calculate_correlations(holdings)

            # Estimate portfolio metrics
            max_drawdown = self._estimate_max_drawdown(individual_risks)
            var_95 = self._estimate_var(individual_risks, total_value)

            # Generate recommendations
            rebalancing = self._generate_rebalancing(individual_risks)
            warnings = self._generate_portfolio_warnings(individual_risks)

            return {
                "total_value_usd": total_value,
                "overall_risk_score": int(weighted_risk),
                "risk_level": self._score_to_level(weighted_risk),
                "diversification_score": diversification_score,
                "correlation_matrix": correlation_matrix,
                "risk_by_holding": individual_risks,
                "max_drawdown_estimate": max_drawdown,
                "value_at_risk_95": var_95,
                "rebalancing_suggestions": rebalancing,
                "warnings": warnings
            }

        except Exception as e:
            logger.error(f"Portfolio risk assessment failed: {e}")
            raise

    async def get_market_risk(self) -> Dict:
        """
        Get overall crypto market risk indicators.

        Returns:
            Market risk metrics
        """
        try:
            # TODO: Fetch real market data
            # - Fear & Greed Index
            # - Market volatility
            # - Total market cap changes
            # - BTC dominance

            return {
                "fear_greed_index": 45,  # 0-100: extreme fear to extreme greed
                "market_volatility": 0.68,  # 0-1
                "btc_dominance": 52.5,  # percentage
                "systemic_risk_level": "medium",
                "key_risks": [
                    "Increasing regulatory scrutiny",
                    "High leverage in derivatives markets"
                ]
            }

        except Exception as e:
            logger.error(f"Failed to fetch market risk: {e}")
            raise

    async def _gather_risk_metrics(
        self,
        coin_symbol: str,
        chain: Optional[str]
    ) -> Dict[str, float]:
        """Gather all risk-related metrics for a coin."""
        # Fetch blockchain data
        coin_data = await self.blockchain_service.get_coin_data(coin_symbol, chain)

        if not coin_data:
            return {}

        return {
            "contract_age_days": coin_data.get("contract_age_days", 0),
            "liquidity_usd": coin_data.get("liquidity_usd", 0),
            "volatility_30d": coin_data.get("volatility_30d", 0),
            "top_10_holder_percentage": coin_data.get("top_10_holder_percentage", 0),
            "sentiment_score": coin_data.get("sentiment_score", 0),
            "audit_score": coin_data.get("audit_score", 0)
        }

    def _calculate_diversification(self, holdings: List[Dict]) -> int:
        """Calculate portfolio diversification score (0-100)."""
        # Simple diversification score based on:
        # 1. Number of holdings
        # 2. Distribution of allocations

        num_holdings = len(holdings)

        # Score based on count (diminishing returns)
        count_score = min(100, num_holdings * 20)

        # Penalize concentrated positions
        max_allocation = max(h["allocation_percentage"] for h in holdings)
        concentration_penalty = max_allocation - 20  # Penalty if any position > 20%
        concentration_penalty = max(0, concentration_penalty)

        diversification = count_score - concentration_penalty

        return max(0, min(100, int(diversification)))

    def _calculate_correlations(self, holdings: List[Dict]) -> Dict[str, Dict[str, float]]:
        """Calculate simplified correlation matrix."""
        # TODO: Implement actual correlation calculation using historical price data
        # For now, return dummy correlations

        matrix = {}
        for h1 in holdings:
            symbol1 = h1["coin_symbol"]
            matrix[symbol1] = {}
            for h2 in holdings:
                symbol2 = h2["coin_symbol"]
                if symbol1 == symbol2:
                    matrix[symbol1][symbol2] = 1.0
                else:
                    # Assume moderate correlation (0.6) for crypto assets
                    matrix[symbol1][symbol2] = 0.6

        return matrix

    def _estimate_max_drawdown(self, risks: List[Dict]) -> float:
        """Estimate maximum portfolio drawdown percentage."""
        # Simple estimate based on highest risk asset
        max_risk = max(r["risk_score"] for r in risks) if risks else 50

        # Higher risk = higher potential drawdown
        drawdown = -1 * (max_risk / 100) * 80  # Up to -80% for highest risk

        return round(drawdown, 2)

    def _estimate_var(self, risks: List[Dict], total_value: float) -> float:
        """Estimate Value at Risk (95% confidence)."""
        # Simple VaR estimate
        avg_risk = sum(r["risk_score"] for r in risks) / len(risks) if risks else 50

        # VaR as percentage of total value
        var_percentage = (avg_risk / 100) * 0.3  # Up to 30% at maximum risk

        return round(total_value * var_percentage, 2)

    def _generate_rebalancing(self, risks: List[Dict]) -> List[str]:
        """Generate portfolio rebalancing suggestions."""
        suggestions = []

        # Check for overconcentration in high-risk assets
        high_risk_allocation = sum(
            r["allocation_percentage"]
            for r in risks
            if r["risk_level"] in ["high", "critical"]
        )

        if high_risk_allocation > 30:
            suggestions.append(
                f"High-risk assets represent {high_risk_allocation:.1f}% of portfolio. "
                "Consider reducing exposure to below 25%."
            )

        # Check for underdiversification
        if len(risks) < 5:
            suggestions.append(
                "Portfolio has fewer than 5 assets. Consider increasing diversification."
            )

        return suggestions

    def _generate_portfolio_warnings(self, risks: List[Dict]) -> List[str]:
        """Generate portfolio-level warnings."""
        warnings = []

        # Check for critical risk assets
        critical_assets = [r for r in risks if r["risk_level"] == "critical"]
        if critical_assets:
            warnings.append(
                f"Portfolio contains {len(critical_assets)} asset(s) with critical risk level"
            )

        return warnings

    def _score_to_level(self, score: float) -> str:
        """Convert risk score to risk level."""
        if score >= 75:
            return "critical"
        elif score >= 50:
            return "high"
        elif score >= 25:
            return "medium"
        else:
            return "low"
