#!/bin/bash

# 🚀 Quick Deploy Script for AI Whale Service
# This script helps you deploy both dashboards with minimal configuration

set -e  # Exit on error

echo "🚀 AI Whale Service - Quick Deploy"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Error: docker-compose.yml not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "📋 Pre-flight checks..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Please install Docker first.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker found: $(docker --version)${NC}"
echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
echo ""

# Step 1: Environment setup
echo "🔧 Step 1: Setting up environment variables..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env not found. Creating from example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env and change MASTER_API_KEY before production!${NC}"
else
    echo -e "${GREEN}✅ Backend .env exists${NC}"
fi

# Demo dashboard env
if [ ! -f "apps/demo-dashboard/.env.local" ]; then
    echo -e "${YELLOW}⚠️  Demo dashboard .env.local not found. Creating...${NC}"
    cd apps/demo-dashboard
    cp .env.example .env.local
    # Set default API URL
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
    cd ../..
    echo -e "${GREEN}✅ Created apps/demo-dashboard/.env.local${NC}"
else
    echo -e "${GREEN}✅ Demo dashboard .env.local exists${NC}"
fi

# Customer dashboard env
if [ ! -f "apps/customer-dashboard/.env.local" ]; then
    echo -e "${YELLOW}⚠️  Customer dashboard .env.local not found. Creating...${NC}"
    cd apps/customer-dashboard
    cp .env.example .env.local
    # Set default API URL
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
    cd ../..
    echo -e "${GREEN}✅ Created apps/customer-dashboard/.env.local${NC}"
else
    echo -e "${GREEN}✅ Customer dashboard .env.local exists${NC}"
fi

echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
echo "Installing demo dashboard dependencies..."
cd apps/demo-dashboard
npm install --silent
cd ../..
echo -e "${GREEN}✅ Demo dashboard dependencies installed${NC}"

echo "Installing customer dashboard dependencies..."
cd apps/customer-dashboard
npm install --silent
cd ../..
echo -e "${GREEN}✅ Customer dashboard dependencies installed${NC}"

echo ""

# Step 3: Build production bundles
echo "🏗️  Step 3: Building production bundles..."
echo "Building demo dashboard..."
cd apps/demo-dashboard
npm run build
cd ../..
echo -e "${GREEN}✅ Demo dashboard built successfully${NC}"

echo "Building customer dashboard..."
cd apps/customer-dashboard
npm run build
cd ../..
echo -e "${GREEN}✅ Customer dashboard built successfully${NC}"

echo ""

# Step 4: Start services
echo "🐳 Step 4: Starting services with Docker Compose..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Docker services started${NC}"
else
    echo -e "${RED}❌ Some Docker services failed to start${NC}"
    docker-compose ps
    exit 1
fi

echo ""

# Step 5: Health checks
echo "🏥 Step 5: Running health checks..."

# Check backend API
if curl -s http://localhost:8000/v1/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend API is healthy (port 8000)${NC}"
else
    echo -e "${YELLOW}⚠️  Backend API not responding yet (may need more time)${NC}"
fi

echo ""

# Step 6: Start Next.js apps
echo "🚀 Step 6: Starting Next.js applications..."
echo ""
echo -e "${YELLOW}Starting demo dashboard on port 3000...${NC}"
cd apps/demo-dashboard
npm run start &
DEMO_PID=$!
cd ../..

sleep 2

echo -e "${YELLOW}Starting customer dashboard on port 3001...${NC}"
cd apps/customer-dashboard
npm run start &
CUSTOMER_PID=$!
cd ../..

sleep 3

echo ""
echo "✨ ============================================== ✨"
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Your services are now running:"
echo ""
echo -e "  📊 ${GREEN}Demo Dashboard:${NC}       http://localhost:3000"
echo -e "  🔐 ${GREEN}Customer Dashboard:${NC}   http://localhost:3001"
echo -e "  🐳 ${GREEN}Backend API:${NC}          http://localhost:8000"
echo -e "  📖 ${GREEN}API Docs:${NC}             http://localhost:8000/docs"
echo ""
echo "Process IDs:"
echo -e "  Demo Dashboard: ${DEMO_PID}"
echo -e "  Customer Dashboard: ${CUSTOMER_PID}"
echo ""
echo "To stop all services:"
echo -e "  ${YELLOW}docker-compose down${NC}"
echo -e "  ${YELLOW}kill ${DEMO_PID} ${CUSTOMER_PID}${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT SECURITY NOTES:${NC}"
echo -e "  1. Change MASTER_API_KEY in .env before production"
echo -e "  2. Set up HTTPS with SSL certificates"
echo -e "  3. Configure proper CORS origins"
echo -e "  4. Enable rate limiting"
echo ""
echo -e "📋 Check ${GREEN}SHIPPING_CHECKLIST.md${NC} for full production readiness"
echo ""
echo "✨ ============================================== ✨"
