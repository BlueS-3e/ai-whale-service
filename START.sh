#!/bin/bash

# 🚀 Quick Start Script for AI Whale Service Platform
# This script helps you get everything running quickly

set -e

echo "🐋 AI Whale Service - Quick Start"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python is not installed${NC}"
    echo "Please install Python 3.9+ from https://www.python.org/"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Function to check if .env file exists
check_env() {
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  Backend .env not found${NC}"
        echo "Would you like to create it from template? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            cp .env.backend.example .env
            echo -e "${GREEN}✅ Created .env file${NC}"
            echo -e "${YELLOW}⚠️  Please edit .env and configure your RPC URLs${NC}"
        else
            echo -e "${RED}❌ Cannot proceed without .env file${NC}"
            exit 1
        fi
    fi
}

# Setup backend
setup_backend() {
    echo -e "${BLUE}📦 Setting up Backend...${NC}"
    
    # Check .env
    check_env
    
    # Check if web3 dependencies are installed
    if ! python3 -c "import web3" &> /dev/null; then
        echo "Installing Web3 dependencies..."
        pip install -r requirements.web3.txt
    fi
    
    echo -e "${GREEN}✅ Backend setup complete${NC}"
    echo ""
}

# Setup customer dashboard
setup_customer_dashboard() {
    echo -e "${BLUE}📦 Setting up Customer Dashboard...${NC}"
    cd apps/customer-dashboard
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies (this may take a minute)..."
        npm install --silent
    fi
    
    # Check .env.local
    if [ ! -f ".env.local" ]; then
        echo -e "${YELLOW}⚠️  .env.local not found${NC}"
        cp .env.example .env.local
        echo -e "${GREEN}✅ Created .env.local${NC}"
    fi
    
    cd ../..
    echo -e "${GREEN}✅ Customer Dashboard setup complete${NC}"
    echo ""
}

# Setup demo dashboard
setup_demo_dashboard() {
    echo -e "${BLUE}📦 Setting up Demo Dashboard...${NC}"
    cd apps/demo-dashboard
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies (this may take a minute)..."
        npm install --silent
    fi
    
    # Check .env.local
    if [ ! -f ".env.local" ]; then
        echo -e "${YELLOW}⚠️  .env.local not found${NC}"
        cp .env.example .env.local
        echo -e "${GREEN}✅ Created .env.local${NC}"
        echo -e "${YELLOW}⚠️  You need to add your WalletConnect Project ID to .env.local${NC}"
        echo "   Get one free at: https://cloud.walletconnect.com/"
    fi
    
    cd ../..
    echo -e "${GREEN}✅ Demo Dashboard setup complete${NC}"
    echo ""
}

# Menu
echo "What would you like to do?"
echo "1) Setup everything (recommended for first time)"
echo "2) Start backend only"
echo "3) Start customer dashboard only"
echo "4) Start demo dashboard only"
echo "5) Start all services"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo -e "${BLUE}🔧 Setting up everything...${NC}"
        echo ""
        setup_backend
        setup_customer_dashboard
        setup_demo_dashboard
        echo -e "${GREEN}🎉 Setup complete!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Edit .env and configure RPC URLs (or use defaults)"
        echo "2. Get WalletConnect Project ID at https://cloud.walletconnect.com/"
        echo "3. Add it to apps/demo-dashboard/.env.local"
        echo "4. Run ./START.sh again and choose option 5 to start all services"
        ;;
    2)
        setup_backend
        echo -e "${BLUE}🚀 Starting backend...${NC}"
        uvicorn app.main:app --reload --port 8000
        ;;
    3)
        setup_customer_dashboard
        echo -e "${BLUE}🚀 Starting customer dashboard...${NC}"
        cd apps/customer-dashboard && npm run dev
        ;;
    4)
        setup_demo_dashboard
        echo -e "${BLUE}🚀 Starting demo dashboard...${NC}"
        cd apps/demo-dashboard && npm run dev
        ;;
    5)
        echo -e "${BLUE}🚀 Starting all services...${NC}"
        echo ""
        echo "This will open 3 terminals:"
        echo "- Backend at http://localhost:8000"
        echo "- Customer Dashboard at http://localhost:3001"
        echo "- Demo Dashboard at http://localhost:3000"
        echo ""
        echo "Press Ctrl+C in each terminal to stop services"
        echo ""
        
        # Check if tmux is available
        if command -v tmux &> /dev/null; then
            echo "Using tmux for multiple terminals..."
            tmux new-session -d -s aiwhale
            tmux send-keys -t aiwhale "uvicorn app.main:app --reload --port 8000" C-m
            tmux split-window -t aiwhale -h
            tmux send-keys -t aiwhale "cd apps/customer-dashboard && npm run dev" C-m
            tmux split-window -t aiwhale -v
            tmux send-keys -t aiwhale "cd apps/demo-dashboard && npm run dev" C-m
            tmux attach-session -t aiwhale
        else
            echo -e "${YELLOW}⚠️  tmux not installed. Starting services sequentially.${NC}"
            echo "Install tmux for better multi-service management: sudo apt install tmux"
            echo ""
            echo "Starting backend..."
            uvicorn app.main:app --reload --port 8000 &
            BACKEND_PID=$!
            echo ""
            echo "Starting customer dashboard..."
            cd apps/customer-dashboard && npm run dev &
            CUSTOMER_PID=$!
            cd ../..
            echo ""
            echo "Starting demo dashboard..."
            cd apps/demo-dashboard && npm run dev &
            DEMO_PID=$!
            
            # Wait for any process to exit
            wait $BACKEND_PID $CUSTOMER_PID $DEMO_PID
        fi
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac
