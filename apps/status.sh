#!/bin/bash

# Dashboard Status Check Script

echo "📊 AI Whale Service - Dashboard Status"
echo "========================================"
echo ""

# Check Demo Dashboard (Port 3000)
if lsof -i :3000 > /dev/null 2>&1; then
    DEMO_PID=$(lsof -t -i:3000)
    echo "✅ Demo Dashboard: RUNNING (PID: $DEMO_PID)"
    echo "   URL: http://localhost:3000"
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "   Status: Responding ✓"
    else
        echo "   Status: Not responding ✗"
    fi
else
    echo "❌ Demo Dashboard: STOPPED"
    echo "   To start: cd demo-dashboard && npm run dev"
fi

echo ""

# Check Customer Dashboard (Port 3001)
if lsof -i :3001 > /dev/null 2>&1; then
    CUSTOMER_PID=$(lsof -t -i:3001)
    echo "✅ Customer Dashboard: RUNNING (PID: $CUSTOMER_PID)"
    echo "   URL: http://localhost:3001"
    if curl -s http://localhost:3001 > /dev/null 2>&1; then
        echo "   Status: Responding ✓"
    else
        echo "   Status: Not responding ✗"
    fi
else
    echo "❌ Customer Dashboard: STOPPED"
    echo "   To start: cd customer-dashboard && npm run dev"
fi

echo ""

# Check Backend API (Port 8000)
if lsof -i :8000 > /dev/null 2>&1; then
    BACKEND_PID=$(lsof -t -i:8000)
    echo "✅ Backend API: RUNNING (PID: $BACKEND_PID)"
    echo "   URL: http://localhost:8000"
    if curl -s http://localhost:8000/v1/health > /dev/null 2>&1; then
        echo "   Status: Healthy ✓"
    else
        echo "   Status: Unhealthy ✗"
    fi
else
    echo "❌ Backend API: STOPPED"
    echo "   To start: uvicorn app.main:app --reload"
fi

echo ""
echo "========================================"
