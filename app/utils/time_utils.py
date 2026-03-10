"""Time and date utilities."""
from datetime import datetime, timedelta
from typing import Optional
import pytz


def utc_now() -> datetime:
    """
    Get current UTC time.

    Returns:
        Current UTC datetime
    """
    return datetime.utcnow()


def parse_timeframe(timeframe: str) -> timedelta:
    """
    Parse timeframe string to timedelta.

    Args:
        timeframe: String like "1h", "24h", "7d", "30d"

    Returns:
        Timedelta object
    """
    mapping = {
        "1h": timedelta(hours=1),
        "24h": timedelta(hours=24),
        "7d": timedelta(days=7),
        "30d": timedelta(days=30),
        "1d": timedelta(days=1),
        "1w": timedelta(weeks=1),
        "1m": timedelta(days=30),
    }

    return mapping.get(timeframe.lower(), timedelta(days=7))


def get_start_time(timeframe: str) -> datetime:
    """
    Get start time based on timeframe from now.

    Args:
        timeframe: Timeframe string

    Returns:
        Start datetime
    """
    delta = parse_timeframe(timeframe)
    return utc_now() - delta


def format_timestamp(dt: datetime, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    Format datetime to string.

    Args:
        dt: Datetime object
        format_str: Format string

    Returns:
        Formatted string
    """
    return dt.strftime(format_str)


def parse_timestamp(timestamp: str, format_str: str = "%Y-%m-%d %H:%M:%S") -> datetime:
    """
    Parse timestamp string to datetime.

    Args:
        timestamp: Timestamp string
        format_str: Format string

    Returns:
        Datetime object
    """
    return datetime.strptime(timestamp, format_str)


def convert_timezone(
    dt: datetime,
    from_tz: str = "UTC",
    to_tz: str = "America/New_York"
) -> datetime:
    """
    Convert datetime between timezones.

    Args:
        dt: Datetime object
        from_tz: Source timezone
        to_tz: Target timezone

    Returns:
        Converted datetime
    """
    from_zone = pytz.timezone(from_tz)
    to_zone = pytz.timezone(to_tz)

    # Localize to from_tz if naive
    if dt.tzinfo is None:
        dt = from_zone.localize(dt)

    return dt.astimezone(to_zone)


def get_time_intervals(
    start: datetime,
    end: datetime,
    interval: timedelta
) -> list:
    """
    Generate list of time intervals between start and end.

    Args:
        start: Start datetime
        end: End datetime
        interval: Interval between points

    Returns:
        List of datetimes
    """
    intervals = []
    current = start

    while current <= end:
        intervals.append(current)
        current += interval

    return intervals


def is_trading_hours(dt: Optional[datetime] = None) -> bool:
    """
    Check if current time is during trading hours.

    Note: Crypto trades 24/7, but this can be used for
    traditional market hours if integrating stocks.

    Args:
        dt: Datetime to check (default: now)

    Returns:
        True if during trading hours
    """
    if dt is None:
        dt = utc_now()

    # Crypto trades 24/7
    return True


def seconds_until(target: datetime) -> int:
    """
    Calculate seconds until target time.

    Args:
        target: Target datetime

    Returns:
        Seconds until target
    """
    delta = target - utc_now()
    return int(delta.total_seconds())
