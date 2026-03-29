#!/bin/bash

# Restart All Dashboards Script

echo "🔄 Restarting BNB Whale AI Dashboards..."
echo ""

# Stop existing processes
echo "🛑 Stopping existing processes..."

# Kill demo dashboard (port 3000)
if lsof -i :3000 > /dev/null 2>&1; then
    echo "   Stopping demo dashboard..."
    kill $(lsof -t -i:3000) 2>/dev/null
    sleep 2
fi

# Kill customer dashboard (port 3001)
if lsof -i :3001 > /dev/null 2>&1; then
    echo "   Stopping customer dashboard..."
    kill $(lsof -t -i:3001) 2>/dev/null
    sleep 2
fi

echo "✅ Old processes stopped"
echo ""

# Now run the start script
./start.sh
