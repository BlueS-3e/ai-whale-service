"""Scheduler configuration for Celery Beat."""
from celery.schedules import crontab

# This file can be used for additional schedule configuration
# The main schedule is in celery_app.py

# You can define custom schedules here and import them
CUSTOM_SCHEDULES = {
    # Example: Run specific coin updates
    "update-btc-data": {
        "task": "app.workers.tasks.data_refresh.fetch_coin_data",
        "schedule": crontab(minute="*/5"),  # Every 5 minutes
        "args": ("BTC",)
    },
}
