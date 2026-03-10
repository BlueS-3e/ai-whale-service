#!/bin/bash

# AI Whale Service - Start All Services
# This script starts the backend API, Celery workers, and frontend dashboards

set -e

echo "🚀 Starting AI Whale Service Platform..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment not found. Creating...${NC}"
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Start Backend API
echo -e "${BLUE}📡 Starting FastAPI Backend (port 8000)...${NC}"
uvicorn app.main:app --host 0.0.0.0 --port 8000 > logs/api.log 2>&1 &
API_PID=$!
echo "   Backend PID: $API_PID"

# Wait for API to be ready
sleep 3

# Check if frontend dependencies are installed
if [ ! -d "apps/demo-dashboard/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing Demo Dashboard dependencies...${NC}"
    cd apps/demo-dashboard
    npm install
    cd ../..
fi

if [ ! -d "apps/customer-dashboard/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing Customer Dashboard dependencies...${NC}"
    cd apps/customer-dashboard
    npm install
    cd ../..
fi

# Start Demo Dashboard
echo -e "${BLUE}🎨 Starting Demo Dashboard (port 3000)...${NC}"
cd apps/demo-dashboard
npm run dev > ../../logs/demo.log 2>&1 &
DEMO_PID=$!
cd ../..
echo "   Demo PID: $DEMO_PID"

# Start Customer Dashboard
echo -e "${BLUE}👥 Starting Customer Dashboard (port 3001)...${NC}"
cd apps/customer-dashboard
npm run dev > ../../logs/customer.log 2>&1 &
CUSTOMER_PID=$!
cd ../..
echo "   Customer PID: $CUSTOMER_PID"

# Wait for services to start
echo ""
echo -e "${YELLOW}⏳ Waiting for services to initialize...${NC}"
sleep 5

echo ""
echo -e "${GREEN}✅ All services started successfully!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🌐 Service URLs:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "  ${BLUE}Backend API:${NC}           http://localhost:8000"
echo -e "  ${BLUE}API Documentation:${NC}     http://localhost:8000/docs"
echo -e "  ${BLUE}Demo Dashboard:${NC}        http://localhost:3000"
echo -e "  ${BLUE}Customer Dashboard:${NC}    http://localhost:3001"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📋 Process IDs:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Backend API:           $API_PID"
echo "  Demo Dashboard:        $DEMO_PID"
echo "  Customer Dashboard:    $CUSTOMER_PID"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "  • View logs in the logs/ directory"
echo "  • Use Ctrl+C to stop this script"
echo "  • Run ./STOP.sh to stop all services"
echo ""
echo -e "${GREEN}🎉 Ready to go! Open http://localhost:3000 to see the demo${NC}"
echo ""

# Save PIDs to file for cleanup
echo "$API_PID" > .pids
echo "$DEMO_PID" >> .pids
echo "$CUSTOMER_PID" >> .pids

# Keep script running and handle Ctrl+C
trap 'echo ""; echo "🛑 Stopping all services..."; kill $API_PID $DEMO_PID $CUSTOMER_PID 2>/dev/null; rm -f .pids; echo "✅ All services stopped"; exit 0' INT

# Wait for any process to exit
wait
