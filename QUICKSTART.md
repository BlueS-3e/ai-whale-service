# 🚀 Quick Start Guide

This guide will help you get your AI Whale Service up and running quickly.

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 15+ (or use Docker Compose)
- Redis 7+ (or use Docker Compose)
- Git

## 🏃 Quick Setup (5 minutes)

### 1. Set Up Environment

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings (use any text editor)
nano .env
```

**Minimum required changes:**
- `DATABASE_URL` - Update with your PostgreSQL connection string
- `REDIS_URL` - Update with your Redis connection string
- `MASTER_API_KEY` - Change to a secure key

### 3. Start Services (Option A: Docker)

**Easiest way - use Docker Compose:**

```bash
# Start all services (PostgreSQL, Redis, API, Workers)
docker-compose up -d

# View logs
docker-compose logs -f api
```

The API will be available at http://localhost:8000

### 3. Start Services (Option B: Manual)

**If you prefer to run without Docker:**

```bash
# Terminal 1: Start API server
uvicorn app.main:app --reload

# Terminal 2: Start Celery worker
celery -A app.workers.celery_app worker --loglevel=info

# Terminal 3: Start Celery beat (scheduler)
celery -A app.workers.celery_app beat --loglevel=info
```

## 🧪 Test Your Installation

### 1. Check Health

```bash
curl http://localhost:8000/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "AI Whale Service",
  "version": "1.0.0"
}
```

### 2. Test API Endpoint

```bash
# Test whale prediction
curl -X POST http://localhost:8000/v1/whale/predict \
  -H "X-API-Key: supersecretkey" \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "coin_symbol": "ETH",
    "timeframe": "24h"
  }'
```

### 3. View API Documentation

Open in your browser:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📚 Next Steps

### 1. Integrate Real Models

The current implementation uses dummy models. To integrate real AI models:

**Whale Predictor:**
```python
# In app/models/whale_predictor.py
# Replace _dummy_predict() with actual model:
# self.model = joblib.load(f"{model_path}/whale_model.pkl")
```

**Sentiment Analyzer:**
```python
# Use a transformer model:
from transformers import pipeline
self.model = pipeline("sentiment-analysis", model="finbert")
```

### 2. Connect to Blockchain

Update `app/services/blockchain.py` to connect to real RPC endpoints:

```python
# Use web3.py for Ethereum:
from web3 import Web3
w3 = Web3(Web3.HTTPProvider(settings.ETHEREUM_RPC_URL))
balance = w3.eth.get_balance(wallet_address)
```

### 3. Enable Social Media Scraping

Add API keys to `.env`:
```bash
TWITTER_BEARER_TOKEN=your_token_here
```

Then implement in `app/services/social.py`:
```python
import tweepy
auth = tweepy.OAuth2BearerToken(settings.TWITTER_BEARER_TOKEN)
api = tweepy.API(auth)
```

### 4. Add Database Models

Create SQLAlchemy models for persistence:

```python
# In app/models/db/api_key.py
from app.core.database import Base
from sqlalchemy import Column, String, Integer, DateTime

class APIKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True)
    key = Column(String, unique=True)
    usage_count = Column(Integer, default=0)
    created_at = Column(DateTime)
```

### 5. Run Tests

```bash
# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_api/test_endpoints.py -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html
```

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Make sure PostgreSQL is running
docker-compose ps postgres

# Check connection
psql -h localhost -U user -d aiwhale
```

### Redis Connection Error

```bash
# Make sure Redis is running
docker-compose ps redis

# Test connection
redis-cli ping
```

### Import Errors

```bash
# Make sure you're in the virtual environment
which python  # Should show venv/bin/python

# Reinstall dependencies
pip install -r requirements.txt
```

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

## 📖 Learning Resources

- **FastAPI Tutorial**: https://fastapi.tiangolo.com/tutorial/
- **Celery Documentation**: https://docs.celeryq.dev/
- **SQLAlchemy Tutorial**: https://docs.sqlalchemy.org/tutorial/
- **Transformers (Hugging Face)**: https://huggingface.co/docs/transformers/

## 🎯 Common Tasks

### Add a New Endpoint

1. Create schema in `app/schemas/`
2. Add endpoint in `app/api/v1/endpoints/`
3. Implement service logic in `app/services/`
4. Add tests in `tests/test_api/`

### Add a Background Task

1. Create task in `app/workers/tasks/`
2. Register schedule in `app/workers/celery_app.py`
3. Test with: `celery -A app.workers.celery_app call task_name`

### Add External API Integration

1. Add API key to `.env.example` and `.env`
2. Update `app/core/config.py` settings
3. Create service in `app/services/`
4. Add error handling and retries

## 💡 Tips

- Use Copilot to generate code: Write detailed comments above functions
- Test endpoints in Swagger UI before writing client code
- Monitor Celery tasks: `celery -A app.workers.celery_app events`
- Check logs: `docker-compose logs -f` or view in `logs/` folder
- Use Redis for caching: `await redis.set("key", "value", ex=3600)`

## 🚀 Production Deployment

See `README.md` for production deployment instructions including:
- Environment-specific configs
- Database migrations
- Load balancing
- Monitoring setup
- Security hardening

---

**Need help?** Check the main README.md or open an issue!
