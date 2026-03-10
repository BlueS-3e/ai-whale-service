#!/usr/bin/env python3
"""
Script to train sentiment analysis model.

Usage:
    python scripts/train_sentiment_model.py --data-path ./data/sentiment_training.csv
"""
import argparse
import sys
import os
import pandas as pd

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger(__name__)


def load_training_data(data_path: str) -> pd.DataFrame:
    """
    Load training data from CSV.
    
    Expected columns:
    - text: Social media post text
    - sentiment: Label (bullish, bearish, neutral)
    - coin_symbol: Related cryptocurrency
    """
    logger.info(f"Loading training data from {data_path}")
    
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data file not found: {data_path}")
    
    df = pd.read_csv(data_path)
    
    required_columns = ["text", "sentiment"]
    if not all(col in df.columns for col in required_columns):
        raise ValueError(f"Data must contain columns: {required_columns}")
    
    logger.info(f"Loaded {len(df)} training examples")
    return df


def preprocess_data(df: pd.DataFrame) -> tuple:
    """
    Preprocess training data.
    
    Returns:
        Tuple of (X, y) - features and labels
    """
    from app.models.utils import clean_text
    
    # Clean text
    df["text_clean"] = df["text"].apply(clean_text)
    
    # Encode labels
    label_map = {"bearish": 0, "neutral": 1, "bullish": 2}
    df["label"] = df["sentiment"].map(label_map)
    
    X = df["text_clean"].values
    y = df["label"].values
    
    return X, y


def train_model(X, y, model_output_path: str):
    """
    Train sentiment analysis model.
    
    Args:
        X: Training features
        y: Training labels
        model_output_path: Path to save trained model
    """
    logger.info("Training sentiment model")
    
    # TODO: Implement actual model training
    # Option 1: Fine-tune transformer model
    # from transformers import AutoModelForSequenceClassification, Trainer
    
    # Option 2: Train simpler model (faster)
    # from sklearn.feature_extraction.text import TfidfVectorizer
    # from sklearn.linear_model import LogisticRegression
    
    # Example with sklearn:
    # from sklearn.model_selection import train_test_split
    # from sklearn.feature_extraction.text import TfidfVectorizer
    # from sklearn.linear_model import LogisticRegression
    # import joblib
    
    # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    
    # vectorizer = TfidfVectorizer(max_features=5000)
    # X_train_vec = vectorizer.fit_transform(X_train)
    # X_test_vec = vectorizer.transform(X_test)
    
    # model = LogisticRegression()
    # model.fit(X_train_vec, y_train)
    
    # score = model.score(X_test_vec, y_test)
    # logger.info(f"Model accuracy: {score:.4f}")
    
    # Save model
    # joblib.dump(model, os.path.join(model_output_path, "sentiment_model.pkl"))
    # joblib.dump(vectorizer, os.path.join(model_output_path, "sentiment_vectorizer.pkl"))
    
    logger.info(f"Model saved to {model_output_path}")
    print(f"Training complete! Model saved to {model_output_path}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Train sentiment analysis model")
    parser.add_argument(
        "--data-path",
        type=str,
        required=True,
        help="Path to training data CSV"
    )
    parser.add_argument(
        "--output-path",
        type=str,
        default=settings.MODEL_PATH,
        help="Path to save trained model"
    )
    
    args = parser.parse_args()
    
    try:
        # Load data
        df = load_training_data(args.data_path)
        
        # Preprocess
        X, y = preprocess_data(df)
        
        # Train
        train_model(X, y, args.output_path)
        
    except Exception as e:
        logger.error(f"Training failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
