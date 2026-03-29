#!/bin/bash

# Quick Start Script for BNB Whale AI Frontend
# Runs both dashboards simultaneously

set -e

echo "🚀 Starting BNB Whale AI Dashboards..."
echo ""

# Check if backend is running
if ! curl -s http://localhost:8000/v1/health > /dev/null 2>&1; then
    echo "⚠️  Backend API is not running!"
    echo ""
    echo "Please start the backend first:"
    echo "  cd /home/rhiper/Documents/Model.1"
    echo "  source venv/bin/activate"
    echo "  uvicorn app.main:app --reload"
    echo ""
    read -p "Press Enter when backend is running..."
fi

# Check if dependencies are installed
if [ ! -d "customer-dashboard/node_modules" ]; then
    echo "📦 Installing customer dashboard dependencies..."
    cd customer-dashboard
    npm install
    cd ..
fi

if [ ! -d "demo-dashboard/node_modules" ]; then
    echo "📦 Installing demo dashboard dependencies..."
    cd demo-dashboard
    npm install
    cd ..
fi

echo ""
echo "✅ Dependencies installed"
echo ""
echo "Starting dashboards..."
echo ""

# Start customer dashboard in background
cd customer-dashboard
npm run dev > /tmp/customer-dashboard.log 2>&1 &
CUSTOMER_PID=$!
cd ..

echo "✅ Customer Dashboard starting (PID: $CUSTOMER_PID)"

# Start demo dashboard in background
cd demo-dashboard
npm run dev > /tmp/demo-dashboard.log 2>&1 &
DEMO_PID=$!
cd ..

echo "✅ Demo Dashboard starting (PID: $DEMO_PID)"
echo ""

# Wait for servers to start
echo "⏳ Waiting for servers to initialize..."
sleep 5

echo ""
echo "🎉 All systems running!"
echo ""
echo "📊 Access your dashboards:"
echo "   • Customer Dashboard: http://localhost:3001"
echo "   • Demo Dashboard:     http://localhost:3000"
echo "   • Backend API:        http://localhost:8000"
echo "   • API Docs:          http://localhost:8000/docs"
echo ""
echo "📝 Process IDs:"
echo "   • Customer Dashboard: $CUSTOMER_PID"
echo "   • Demo Dashboard:     $DEMO_PID"
echo ""
echo "🛑 To stop the dashboards:"
echo "   kill $CUSTOMER_PID $DEMO_PID"
echo ""
echo "📋 View logs:"
echo "   tail -f /tmp/customer-dashboard.log"
echo "   tail -f /tmp/demo-dashboard.log"
echo ""

# Save PIDs to file
echo "$CUSTOMER_PID" > /tmp/customer-dashboard.pid
echo "$DEMO_PID" > /tmp/demo-dashboard.pid

echo "Press Ctrl+C to stop monitoring (servers will continue running)"
echo ""

# Monitor both processes
while kill -0 $CUSTOMER_PID 2>/dev/null && kill -0 $DEMO_PID 2>/dev/null; do
    sleep 2
done

echo "⚠️  One or more dashboards stopped!"
