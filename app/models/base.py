"""Base model interface for all AI models."""
from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseModel(ABC):
    """
    Abstract base class for all AI models.

    Ensures consistent interface across different model types.
    """

    def __init__(self, model_path: str):
        """
        Initialize model with path to model files.

        Args:
            model_path: Directory containing model files
        """
        self.model_path = model_path
        self.model = None
        self.is_loaded = False

    @abstractmethod
    def load(self) -> None:
        """Load model from disk into memory."""
        pass

    @abstractmethod
    def predict(self, *args, **kwargs) -> Any:
        """
        Make prediction using the model.

        Returns:
            Prediction result (format depends on model type)
        """
        pass

    def _ensure_loaded(self) -> None:
        """Ensure model is loaded before prediction."""
        if not self.is_loaded:
            self.load()

    def get_metadata(self) -> Dict[str, Any]:
        """
        Get model metadata (version, training date, etc.).

        Returns:
            Dictionary with model metadata
        """
        return {
            "model_path": self.model_path,
            "is_loaded": self.is_loaded,
            "model_type": self.__class__.__name__
        }
