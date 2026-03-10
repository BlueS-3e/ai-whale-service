#!/bin/bash

# AI Whale Service - Stop All Services

echo "🛑 Stopping AI Whale Service Platform..."

# Read PIDs from file
if [ -f ".pids" ]; then
    while read pid; do
        if ps -p $pid > /dev/null 2>&1; then
            echo "   Stopping process $pid..."
            kill $pid 2>/dev/null
        fi
    done < .pids
    rm -f .pids
fi

# Kill any remaining processes on the ports
echo "   Cleaning up ports..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

echo "✅ All services stopped"
