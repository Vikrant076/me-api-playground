#!/bin/bash

# Build and deploy the application
echo "Building and deploying Me-API Playground..."

# Build backend and frontend
echo "Building backend..."
cd backend
npm install
npm run init-db

echo "Building frontend..."
cd ../frontend
npm install
npm run build

echo "Starting services with Docker Compose..."
cd ..
docker-compose up -d --build

echo "Deployment complete!"
echo "Backend API: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo "Health check: http://localhost:5000/health"
