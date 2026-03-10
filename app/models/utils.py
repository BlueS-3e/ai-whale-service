"""Model utility functions."""
import re
from typing import List


def tokenize_text(text: str) -> List[str]:
    """
    Simple text tokenization.
    
    Args:
        text: Input text
    
    Returns:
        List of tokens
    """
    # Convert to lowercase and split on whitespace and punctuation
    tokens = re.findall(r'\b\w+\b', text.lower())
    return tokens


def clean_text(text: str) -> str:
    """
    Clean and normalize text.
    
    Args:
        text: Raw text
    
    Returns:
        Cleaned text
    """
    # Remove URLs
    text = re.sub(r'http\S+|www\S+', '', text)
    
    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    
    # Remove special characters (keep basic punctuation)
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    return text


def extract_crypto_mentions(text: str) -> List[str]:
    """
    Extract cryptocurrency mentions from text.
    
    Args:
        text: Input text
    
    Returns:
        List of mentioned cryptocurrencies
    """
    # Common crypto patterns
    patterns = [
        r'\b(BTC|ETH|SOL|ADA|DOT|MATIC|AVAX|LINK|UNI)\b',  # Ticker symbols
        r'\$([A-Z]{3,5})\b',  # $TICKER format
        r'\b(Bitcoin|Ethereum|Solana|Cardano|Polkadot)\b'  # Full names
    ]
    
    mentions = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        mentions.extend(matches)
    
    # Remove duplicates and normalize
    mentions = list(set([m.upper() for m in mentions]))
    
    return mentions


def normalize_wallet_address(address: str) -> str:
    """
    Normalize blockchain wallet address.
    
    Args:
        address: Wallet address
    
    Returns:
        Normalized address
    """
    # Remove whitespace
    address = address.strip()
    
    # Ensure proper format (0x prefix for ETH-like addresses)
    if not address.startswith('0x') and len(address) == 40:
        address = '0x' + address
    
    return address.lower()
