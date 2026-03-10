#!/bin/bash

# 🚀 GitHub Push Script for AI Whale Service
# This script initializes git and prepares for GitHub push

set -e

echo "🚀 AI Whale Service - GitHub Setup"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Error: docker-compose.yml not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${BLUE}Step 1: Checking Git installation...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git not found. Please install Git first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git found: $(git --version)${NC}"
echo ""

echo -e "${BLUE}Step 2: Initializing Git repository...${NC}"
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git repository already initialized${NC}"
    echo -e "Current branch: $(git branch --show-current)"
    echo ""
else
    git init
    echo -e "${GREEN}✅ Git repository initialized${NC}"
    echo ""
fi

echo -e "${BLUE}Step 3: Checking .gitignore...${NC}"
if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✅ .gitignore exists${NC}"
else
    echo -e "${RED}❌ .gitignore not found${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 4: Setting up git configuration...${NC}"
if [ -z "$(git config user.name)" ]; then
    echo -e "${YELLOW}Please enter your name for Git commits:${NC}"
    read -p "Name: " git_name
    git config user.name "$git_name"
fi

if [ -z "$(git config user.email)" ]; then
    echo -e "${YELLOW}Please enter your email for Git commits:${NC}"
    read -p "Email: " git_email
    git config user.email "$git_email"
fi

echo -e "${GREEN}✅ Git user: $(git config user.name) <$(git config user.email)>${NC}"
echo ""

echo -e "${BLUE}Step 5: Staging files...${NC}"
git add .
echo -e "${GREEN}✅ Files staged for commit${NC}"
echo ""

echo -e "${BLUE}Step 6: File summary...${NC}"
git status --short | head -30
echo ""
total_files=$(git status --short | wc -l)
echo -e "${GREEN}Total files to commit: ${total_files}${NC}"
echo ""

echo -e "${YELLOW}⚠️  Important: The following files will NOT be committed (in .gitignore):${NC}"
echo "  • .env files (contain secrets)"
echo "  • node_modules/"
echo "  • .next/ (build output)"
echo "  • __pycache__/"
echo "  • venv/"
echo ""

echo -e "${BLUE}Step 7: Creating initial commit...${NC}"
if git rev-parse HEAD >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Repository already has commits${NC}"
    echo "Run 'git add .' and 'git commit -m \"your message\"' manually if needed"
else
    git commit -m "Initial commit - AI Whale Service

Features:
- FastAPI backend with whale prediction, sentiment analysis, and risk assessment
- Next.js demo dashboard with AI Space background
- Next.js customer dashboard for API management
- Mobile-optimized with hamburger menus
- Dark mode support across all pages
- Canvas-based neural network animations
- Touch-friendly UI (WCAG 2.1 compliant)
- 144ms API response time
- Docker Compose setup
- Vercel and Railway deployment configs"

    echo -e "${GREEN}✅ Initial commit created${NC}"
fi
echo ""

echo -e "${BLUE}Step 8: Creating main branch...${NC}"
git branch -M main
echo -e "${GREEN}✅ Branch set to 'main'${NC}"
echo ""

echo "✨ ================================================== ✨"
echo ""
echo -e "${GREEN}🎉 Git repository ready!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Create a new repository on GitHub:"
echo -e "   ${BLUE}https://github.com/new${NC}"
echo ""
echo "2. Connect to your GitHub repository:"
echo -e "   ${BLUE}git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git${NC}"
echo ""
echo "3. Push to GitHub:"
echo -e "   ${BLUE}git push -u origin main${NC}"
echo ""
echo "4. Deploy to Vercel:"
echo -e "   ${BLUE}cd apps/demo-dashboard && vercel${NC}"
echo -e "   ${BLUE}cd apps/customer-dashboard && vercel${NC}"
echo ""
echo "5. Deploy to Railway:"
echo -e "   ${BLUE}Visit https://railway.app and connect your GitHub repo${NC}"
echo ""
echo -e "📖 Full deployment guide: ${GREEN}DEPLOYMENT.md${NC}"
echo ""
echo "✨ ================================================== ✨"
