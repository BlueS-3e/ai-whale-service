# BNB Whale AI 🐋

AI-as-a-service platform for BNB ecosystem whale movement prediction, sentiment analysis, and risk assessment.

## 🚀 Features

- **Whale Movement Prediction**: AI-powered prediction of large wallet movements
- **Sentiment Analysis**: Real-time social media sentiment tracking
- **Risk Scoring**: Comprehensive risk assessment for crypto assets
- **RESTful API**: Version-controlled API with authentication
- **Background Workers**: Celery-based task processing for data updates and model retraining
- **Scalable Architecture**: Modular design with PostgreSQL and Redis

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

## 🛠️ Setup

### 1. Clone and Navigate

```bash
cd ai-whale-service
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### 5. Start Services (Docker)

```bash
docker-compose up -d
```

### 6. Run Migrations

```bash
# TODO: Add alembic migrations
```

### 7. Start API Server

```bash
uvicorn app.main:app --reload
```

### 8. Start Background Workers

```bash
celery -A app.workers.celery_app worker --loglevel=info
celery -A app.workers.celery_app beat --loglevel=info
```

## 📖 API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🧪 Testing

```bash
pytest tests/ -v
```

## 📁 Project Structure

```
app/
├── api/          # API endpoints (versioned)
├── core/         # Configuration and utilities
├── models/       # AI model loading & inference
├── schemas/      # Pydantic request/response models
├── services/     # Business logic
├── workers/      # Background tasks
└── utils/        # Helper functions
```

## 🔑 Authentication

All API endpoints (except `/health`) require an API key:

```bash
curl -H "X-API-Key: your-key-here" http://localhost:8000/v1/whale/predict
```

## 📊 Example Usage

### Whale Prediction

```bash
curl -X POST http://localhost:8000/v1/whale/predict \
  -H "X-API-Key: your-key" \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x123...",
    "coin_symbol": "BTC"
  }'
```

### Sentiment Analysis

```bash
curl -X POST http://localhost:8000/v1/sentiment/analyze \
  -H "X-API-Key: your-key" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bitcoin is looking bullish!",
    "coin_symbol": "BTC"
  }'
```

## 🐳 Docker Deployment

```bash
docker build -t ai-whale-service .
docker run -p 8000:8000 --env-file .env ai-whale-service
```

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.
