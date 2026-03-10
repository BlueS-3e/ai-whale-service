"""Text processing utilities."""
import re
from typing import List


def clean_html(text: str) -> str:
    """
    Remove HTML tags from text.

    Args:
        text: Text with HTML

    Returns:
        Clean text
    """
    # Simple HTML tag removal (for more complex cases, use BeautifulSoup)
    return re.sub(r'<[^>]+>', '', text)


def remove_urls(text: str) -> str:
    """
    Remove URLs from text.

    Args:
        text: Text with URLs

    Returns:
        Text without URLs
    """
    return re.sub(r'http\S+|www\S+', '', text)


def remove_mentions(text: str) -> str:
    """
    Remove @mentions from text.

    Args:
        text: Text with mentions

    Returns:
        Text without mentions
    """
    return re.sub(r'@\w+', '', text)


def remove_hashtags(text: str, keep_text: bool = True) -> str:
    """
    Remove or clean hashtags from text.

    Args:
        text: Text with hashtags
        keep_text: If True, keep the word without #

    Returns:
        Cleaned text
    """
    if keep_text:
        return re.sub(r'#(\w+)', r'\1', text)
    else:
        return re.sub(r'#\w+', '', text)


def extract_mentions(text: str) -> List[str]:
    """
    Extract @mentions from text.

    Args:
        text: Text to extract from

    Returns:
        List of mentions
    """
    return re.findall(r'@(\w+)', text)


def extract_hashtags(text: str) -> List[str]:
    """
    Extract hashtags from text.

    Args:
        text: Text to extract from

    Returns:
        List of hashtags (without #)
    """
    return re.findall(r'#(\w+)', text)


def normalize_whitespace(text: str) -> str:
    """
    Normalize whitespace in text.

    Args:
        text: Text with irregular whitespace

    Returns:
        Text with normalized whitespace
    """
    return ' '.join(text.split())


def truncate_text(text: str, max_length: int = 280, suffix: str = "...") -> str:
    """
    Truncate text to maximum length.

    Args:
        text: Text to truncate
        max_length: Maximum length
        suffix: Suffix to add if truncated

    Returns:
        Truncated text
    """
    if len(text) <= max_length:
        return text

    return text[:max_length - len(suffix)] + suffix


def count_words(text: str) -> int:
    """
    Count words in text.

    Args:
        text: Text to count

    Returns:
        Word count
    """
    return len(text.split())


def extract_crypto_symbols(text: str) -> List[str]:
    """
    Extract cryptocurrency symbols from text.

    Args:
        text: Text to extract from

    Returns:
        List of crypto symbols
    """
    # Match $SYMBOL or #SYMBOL patterns
    symbols = re.findall(r'[$#]([A-Z]{2,5})\b', text)

    # Also check for common full names
    common_cryptos = {
        'bitcoin': 'BTC',
        'ethereum': 'ETH',
        'solana': 'SOL',
        'cardano': 'ADA',
        'polkadot': 'DOT',
    }

    text_lower = text.lower()
    for name, symbol in common_cryptos.items():
        if name in text_lower:
            symbols.append(symbol)

    return list(set(symbols))  # Remove duplicates
