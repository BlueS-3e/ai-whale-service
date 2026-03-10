.PHONY: help install dev test clean docker-up docker-down docker-logs format lint

help:
	@echo "AI Whale Service - Available Commands"
	@echo "====================================="
	@echo "make install      - Install dependencies"
	@echo "make dev          - Start development server"
	@echo "make test         - Run tests"
	@echo "make test-cov     - Run tests with coverage"
	@echo "make clean        - Clean cache and temp files"
	@echo "make docker-up    - Start all services with Docker"
	@echo "make docker-down  - Stop all services"
	@echo "make docker-logs  - View Docker logs"
	@echo "make format       - Format code with black"
	@echo "make lint         - Lint code with flake8"
	@echo "make worker       - Start Celery worker"
	@echo "make beat         - Start Celery beat scheduler"

install:
	pip install -r requirements.txt

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	pytest tests/ -v

test-cov:
	pytest tests/ --cov=app --cov-report=html --cov-report=term

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf .pytest_cache .coverage htmlcov

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-rebuild:
	docker-compose up -d --build

format:
	black app/ tests/ scripts/
	isort app/ tests/ scripts/

lint:
	flake8 app/ tests/ scripts/ --max-line-length=100 --extend-ignore=E203,W503

worker:
	celery -A app.workers.celery_app worker --loglevel=info

beat:
	celery -A app.workers.celery_app beat --loglevel=info

# Database commands
db-upgrade:
	alembic upgrade head

db-downgrade:
	alembic downgrade -1

db-revision:
	alembic revision --autogenerate -m "$(message)"

# Development shortcuts
run-all:
	@echo "Starting API, Worker, and Beat in background..."
	uvicorn app.main:app --reload & \
	celery -A app.workers.celery_app worker --loglevel=info & \
	celery -A app.workers.celery_app beat --loglevel=info &
