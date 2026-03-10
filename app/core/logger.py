"""Logging configuration for the application."""
import logging
import sys
from app.core.config import settings

# Create logger
logger = logging.getLogger("aiwhale")
logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))

# Create console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))

# Create formatter
formatter = logging.Formatter(settings.LOG_FORMAT)
console_handler.setFormatter(formatter)

# Add handler to logger
if not logger.handlers:
    logger.addHandler(console_handler)

# Prevent propagation to root logger
logger.propagate = False


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for a specific module.

    Args:
        name: Module name

    Returns:
        logging.Logger: Configured logger
    """
    return logging.getLogger(f"aiwhale.{name}")
