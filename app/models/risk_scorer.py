"""Risk scoring model."""
import os
import numpy as np
from typing import Dict, List
from app.models.base import BaseModel
from app.core.logger import get_logger

logger = get_logger(__name__)


class RiskScorer(BaseModel):
    """
    AI model for assessing cryptocurrency risk.
    
    Combines multiple risk factors:
    - Smart contract vulnerabilities
    - Liquidity metrics
    - Volatility
    - Whale concentration
    - Social sentiment
    """
    
    def __init__(self, model_path: str):
        """Initialize risk scorer."""
        super().__init__(model_path)
        self.risk_weights = {
            "smart_contract": 0.25,
            "liquidity": 0.20,
            "volatility": 0.20,
            "whale_concentration": 0.20,
            "sentiment": 0.15
        }
    
    def load(self) -> None:
        """Load risk assessment model."""
        try:
            # TODO: Load actual risk model
            # model_file = os.path.join(self.model_path, "risk_model.pkl")
            # self.model = joblib.load(model_file)
            
            logger.warning("Using rule-based risk model - train ML model for production")
            self.model = None
            
            self.is_loaded = True
            logger.info("Risk scorer loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load risk model: {e}")
            raise
    
    def predict(self, metrics: Dict[str, float]) -> Dict[str, any]:
        """
        Calculate risk score based on various metrics.
        
        Args:
            metrics: Dictionary with risk metrics:
                - contract_age_days: Age of smart contract
                - liquidity_usd: Available liquidity
                - volatility_30d: 30-day volatility
                - top_10_holder_percentage: % held by top 10 wallets
                - sentiment_score: Social sentiment (-1 to 1)
                - audit_score: Contract audit score (0-100)
        
        Returns:
            Dictionary with risk assessment results
        """
        self._ensure_loaded()
        
        try:
            # Calculate individual risk components
            risk_components = self._calculate_risk_components(metrics)
            
            # Calculate overall risk score
            overall_score = self._calculate_overall_risk(risk_components)
            
            # Determine risk level
            risk_level = self._determine_risk_level(overall_score)
            
            # Generate risk factors
            risk_factors = self._generate_risk_factors(risk_components)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(risk_components)
            
            # Generate warnings
            warnings = self._generate_warnings(risk_components)
            
            return {
                "overall_risk_score": int(overall_score),
                "risk_level": risk_level,
                "smart_contract_risk": risk_components["smart_contract"],
                "liquidity_risk": risk_components["liquidity"],
                "volatility_risk": risk_components["volatility"],
                "whale_concentration_risk": risk_components["whale_concentration"],
                "sentiment_risk": risk_components["sentiment"],
                "risk_factors": risk_factors,
                "recommendations": recommendations,
                "warnings": warnings
            }
            
        except Exception as e:
            logger.error(f"Risk assessment failed: {e}")
            raise
    
    def _calculate_risk_components(self, metrics: Dict[str, float]) -> Dict[str, int]:
        """Calculate individual risk component scores (0-100)."""
        components = {}
        
        # Smart contract risk
        contract_age = metrics.get("contract_age_days", 0)
        audit_score = metrics.get("audit_score", 0)
        if contract_age < 30:
            contract_risk = 80
        elif contract_age < 180:
            contract_risk = 50
        else:
            contract_risk = 20
        # Adjust based on audit
        contract_risk = int(contract_risk * (1 - audit_score / 100))
        components["smart_contract"] = min(100, contract_risk)
        
        # Liquidity risk
        liquidity = metrics.get("liquidity_usd", 0)
        if liquidity < 100000:
            liquidity_risk = 90
        elif liquidity < 1000000:
            liquidity_risk = 60
        elif liquidity < 10000000:
            liquidity_risk = 30
        else:
            liquidity_risk = 10
        components["liquidity"] = liquidity_risk
        
        # Volatility risk
        volatility = metrics.get("volatility_30d", 0)
        volatility_risk = min(100, int(volatility * 100))
        components["volatility"] = volatility_risk
        
        # Whale concentration risk
        top_10_percentage = metrics.get("top_10_holder_percentage", 0)
        if top_10_percentage > 70:
            whale_risk = 90
        elif top_10_percentage > 50:
            whale_risk = 70
        elif top_10_percentage > 30:
            whale_risk = 40
        else:
            whale_risk = 10
        components["whale_concentration"] = whale_risk
        
        # Sentiment risk (inverted - negative sentiment = high risk)
        sentiment = metrics.get("sentiment_score", 0)
        sentiment_risk = int((1 - sentiment) * 50)  # -1 -> 100, 0 -> 50, 1 -> 0
        components["sentiment"] = max(0, min(100, sentiment_risk))
        
        return components
    
    def _calculate_overall_risk(self, components: Dict[str, int]) -> float:
        """Calculate weighted overall risk score."""
        total_risk = 0
        for component, score in components.items():
            weight = self.risk_weights.get(component, 0)
            total_risk += score * weight
        
        return total_risk
    
    def _determine_risk_level(self, score: float) -> str:
        """Determine risk level from score."""
        if score >= 75:
            return "critical"
        elif score >= 50:
            return "high"
        elif score >= 25:
            return "medium"
        else:
            return "low"
    
    def _generate_risk_factors(self, components: Dict[str, int]) -> List[Dict]:
        """Generate list of risk factors."""
        factors = []
        
        for component, score in components.items():
            if score > 60:
                severity = "high" if score > 80 else "medium"
                factors.append({
                    "name": component.replace("_", " ").title(),
                    "score": score,
                    "severity": severity,
                    "description": self._get_factor_description(component, score)
                })
        
        return factors
    
    def _get_factor_description(self, component: str, score: int) -> str:
        """Get description for a risk factor."""
        descriptions = {
            "smart_contract": f"Contract security score indicates elevated risk ({score}/100)",
            "liquidity": f"Low liquidity increases slippage risk ({score}/100)",
            "volatility": f"High price volatility detected ({score}/100)",
            "whale_concentration": f"Significant whale concentration risk ({score}/100)",
            "sentiment": f"Negative social sentiment present ({score}/100)"
        }
        return descriptions.get(component, f"{component} risk: {score}/100")
    
    def _generate_recommendations(self, components: Dict[str, int]) -> List[str]:
        """Generate risk mitigation recommendations."""
        recommendations = []
        
        if components["liquidity"] > 60:
            recommendations.append("Use limit orders to minimize slippage")
        
        if components["volatility"] > 70:
            recommendations.append("Consider position sizing carefully")
            recommendations.append("Set tight stop losses")
        
        if components["whale_concentration"] > 70:
            recommendations.append("Monitor whale wallets for large movements")
        
        if components["smart_contract"] > 60:
            recommendations.append("Verify contract audit reports")
        
        return recommendations
    
    def _generate_warnings(self, components: Dict[str, int]) -> List[str]:
        """Generate risk warnings."""
        warnings = []
        
        if components["volatility"] > 80:
            warnings.append("Extremely high volatility detected")
        
        if components["whale_concentration"] > 75:
            warnings.append("Whale concentration above safe threshold")
        
        if components["liquidity"] > 80:
            warnings.append("Critical liquidity risk - large orders may fail")
        
        if components["smart_contract"] > 75:
            warnings.append("Significant smart contract risks identified")
        
        return warnings
