#!/bin/bash

# Docker Setup Script for Durga Art Zone
# This script sets up the complete Docker environment

echo "🐳 Setting up Durga Art Zone Docker Environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp backend/.env.example .env
    echo "⚠️  Please update .env file with your actual credentials before running the application."
fi

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p backend/logs

# Create MongoDB init script directory
echo "📁 Creating MongoDB init directory..."
mkdir -p scripts

# Create MongoDB init script if it doesn't exist
if [ ! -f scripts/init-mongo.js ]; then
    echo "📝 Creating MongoDB init script..."
    cat > scripts/init-mongo.js << 'EOF'
// MongoDB initialization script
db = db.getSiblingDB('durga_art_zone');

// Create collections with indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ name: "text", description: "text" });
db.orders.createIndex({ customer: 1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });

print("MongoDB initialized successfully");
EOF
fi

# Build and start containers
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if containers are running
echo "🔍 Checking container status..."
docker-compose ps

# Show logs
echo "📋 Showing recent logs..."
docker-compose logs --tail=50

echo "✅ Docker setup complete!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🗄️  MongoDB: mongodb://localhost:27017"
echo ""
echo "🛑 To stop: docker-compose down"
echo "🔄 To restart: docker-compose restart"
echo "📋 To view logs: docker-compose logs -f"
