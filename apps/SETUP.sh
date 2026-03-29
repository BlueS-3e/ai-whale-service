#!/bin/bash

# BNB Whale AI - Frontend Setup Script
# This script sets up both customer and demo dashboards

set -e

echo "🚀 BNB Whale AI - Frontend Setup"
echo "======================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Function to setup a dashboard
setup_dashboard() {
    local name=$1
    local port=$2
    local dir=$3
    
    echo -e "${BLUE}📦 Setting up $name...${NC}"
    cd "$dir"
    
    # Copy env file if not exists
    if [ ! -f .env.local ]; then
        echo "   Creating .env.local from .env.example..."
        cp .env.example .env.local
        echo -e "   ${YELLOW}⚠️  Please edit .env.local with your configuration${NC}"
    else
        echo "   .env.local already exists"
    fi
    
    # Install dependencies
    echo "   Installing dependencies..."
    npm install --silent
    
    echo -e "${GREEN}✅ $name setup complete!${NC}"
    echo ""
    
    cd - > /dev/null
}

# Setup Customer Dashboard
echo "1️⃣  Setting up Customer Dashboard (Port 3001)"
setup_dashboard "Customer Dashboard" 3001 "customer-dashboard"

# Setup Demo Dashboard
echo "2️⃣  Setting up Demo Dashboard (Port 3000)"
setup_dashboard "Demo Dashboard" 3000 "demo-dashboard"

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Configure environment variables:"
echo "   - Edit apps/customer-dashboard/.env.local"
echo "   - Edit apps/demo-dashboard/.env.local"
echo "   - Add your WalletConnect Project ID (get it from https://cloud.walletconnect.com/)"
echo ""
echo "2. Start the backend API:"
echo "   cd /home/rhiper/Documents/Model.1"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload"
echo ""
echo "3. Start the dashboards:"
echo ""
echo "   📊 Customer Dashboard:"
echo "   cd apps/customer-dashboard"
echo "   npm run dev"
echo "   → http://localhost:3001"
echo ""
echo "   🎨 Demo Dashboard:"
echo "   cd apps/demo-dashboard"
echo "   npm run dev"
echo "   → http://localhost:3000"
echo ""
echo "4. Access the applications:"
echo "   • Customer Dashboard: http://localhost:3001"
echo "   • Demo Dashboard: http://localhost:3000"
echo "   • Backend API: http://localhost:8000"
echo "   • API Docs: http://localhost:8000/docs"
echo ""
echo -e "${BLUE}💡 Tip: Use 'npm run dev' in each dashboard directory to start development servers${NC}"
echo ""
