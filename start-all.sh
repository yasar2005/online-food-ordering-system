#!/bin/bash
echo "Starting Full Stack Application..."

# Start backend in background
echo "Starting backend..."
cd springapp
./mvnw spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 30

# Start frontend
echo "Starting frontend..."
cd ../reactapp
npm install
npm start &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend running on: http://localhost:8080"
echo "Frontend running on: http://localhost:8081"
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
wait