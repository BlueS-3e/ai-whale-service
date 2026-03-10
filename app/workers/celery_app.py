"""Celery application configuration."""
from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

# Create Celery app
app = Celery(
    "aiwhale",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

# Celery configuration
app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Auto-discover tasks
app.autodiscover_tasks(["app.workers.tasks"])

# Beat schedule for periodic tasks
app.conf.beat_schedule = {
    "refresh-whale-data-every-hour": {
        "task": "app.workers.tasks.data_refresh.refresh_whale_data",
        "schedule": crontab(minute=0),  # Every hour
    },
    "update-sentiment-every-15min": {
        "task": "app.workers.tasks.data_refresh.update_sentiment_data",
        "schedule": crontab(minute="*/15"),  # Every 15 minutes
    },
    "cleanup-old-data-daily": {
        "task": "app.workers.tasks.data_refresh.cleanup_old_data",
        "schedule": crontab(hour=2, minute=0),  # 2 AM daily
    },
    "retrain-models-weekly": {
        "task": "app.workers.tasks.model_retrain.retrain_all_models",
        "schedule": crontab(day_of_week=1, hour=3, minute=0),  # Monday 3 AM
    },
}

if __name__ == "__main__":
    app.start()
