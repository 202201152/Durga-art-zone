# Docker Setup Script for Durga Art Zone (PowerShell)
# This script sets up the complete Docker environment

Write-Host "🐳 Setting up Durga Art Zone Docker Environment..." -ForegroundColor Green

# Check if Docker is installed
try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
try {
    docker-compose --version | Out-Null
} catch {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

# Create environment file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" ".env"
    Write-Host "⚠️  Please update .env file with your actual credentials before running the application." -ForegroundColor Yellow
}

# Create logs directory
Write-Host "📁 Creating logs directory..." -ForegroundColor Blue
New-Item -ItemType Directory -Force -Path "backend\logs" | Out-Null

# Create MongoDB init script directory
Write-Host "📁 Creating MongoDB init directory..." -ForegroundColor Blue
New-Item -ItemType Directory -Force -Path "scripts" | Out-Null

# Create MongoDB init script if it doesn't exist
if (-not (Test-Path "scripts\init-mongo.js")) {
    Write-Host "📝 Creating MongoDB init script..." -ForegroundColor Yellow
    @"
// MongoDB initialization script
db = db.getSiblingDB('durga_art_zone');

// Create collections with indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ name: "text", description: "text" });
db.orders.createIndex({ customer: 1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });

print("MongoDB initialized successfully");
"@ | Out-File -FilePath "scripts\init-mongo.js" -Encoding UTF8
}

# Build and start containers
Write-Host "🔨 Building Docker images..." -ForegroundColor Blue
docker-compose build

Write-Host "🚀 Starting containers..." -ForegroundColor Green
docker-compose up -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check if containers are running
Write-Host "🔍 Checking container status..." -ForegroundColor Blue
docker-compose ps

# Show logs
Write-Host "📋 Showing recent logs..." -ForegroundColor Blue
docker-compose logs --tail=50

Write-Host "✅ Docker setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🗄️  MongoDB: mongodb://localhost:27017" -ForegroundColor Cyan
Write-Host ""
Write-Host "🛑 To stop: docker-compose down" -ForegroundColor Yellow
Write-Host "🔄 To restart: docker-compose restart" -ForegroundColor Yellow
Write-Host "📋 To view logs: docker-compose logs -f" -ForegroundColor Yellow
