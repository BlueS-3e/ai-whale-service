#!/bin/bash

# Stop all running dashboard processes

echo "🛑 Stopping BNB Whale AI Dashboards..."

# Kill from PID files if they exist
if [ -f /tmp/customer-dashboard.pid ]; then
    PID=$(cat /tmp/customer-dashboard.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        echo "✅ Stopped Customer Dashboard (PID: $PID)"
    fi
    rm /tmp/customer-dashboard.pid
fi

if [ -f /tmp/demo-dashboard.pid ]; then
    PID=$(cat /tmp/demo-dashboard.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        echo "✅ Stopped Demo Dashboard (PID: $PID)"
    fi
    rm /tmp/demo-dashboard.pid
fi

# Also kill any node processes on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "✅ Killed process on port 3000" || true
lsof -ti:3001 | xargs kill -9 2>/dev/null && echo "✅ Killed process on port 3001" || true

echo "✅ All dashboards stopped"
