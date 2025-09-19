#!/bin/bash

# Trap Ctrl+C (SIGINT) to stop both processes
cleanup() {
  echo ""
  echo "Stopping MiniTaskHub backend..."
  kill $BACKEND_PID 2>/dev/null
  exit 0
}
trap cleanup SIGINT

# Kill any previous backend
if pgrep -f "MiniTaskHub.Api" >/dev/null ; then
  echo "Stopping existing MiniTaskHub backend..."
  pkill -f "MiniTaskHub.Api"
fi

# Start backend in background (plus docker image of sqlserver)
if ! docker ps --format '{{.Names}}' | grep -q "^sqlserver$"; then
  echo "Starting sqlserver docker container..."
  docker start sqlserver
else
  echo "sqlserver docker container is already running."
fi
echo "Starting MiniTaskHub backend..."
dotnet run --launch-profile https --project MiniTaskHub.Api &
BACKEND_PID=$!

# Start frontend (blocking)
echo "Starting MiniTaskHub frontend..."
cd MiniTaskHub.Web
npm start

# Cleanup happens automatically on Ctrl+C

