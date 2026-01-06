# 🐳 Docker Setup Guide

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed
- Docker Compose installed
- Git (for cloning)

### One-Command Setup

#### Windows (PowerShell):
```powershell
.\scripts\docker-setup.ps1
```

#### Linux/Mac (Bash):
```bash
chmod +x scripts/docker-setup.sh
./scripts/docker-setup.sh
```

## 📋 Manual Setup Steps

### 1. Environment Configuration
Copy the environment template:
```bash
cp backend/.env.example .env
```

Update `.env` with your actual credentials:
```env
# Database
MONGODB_URI=mongodb://admin:password123@mongodb:27017/durga_art_zone?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret

# Frontend
FRONTEND_URL=http://localhost:3000
ENABLED_FEATURES=google-auth,email-notifications
```

### 2. Build and Run
```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🏗️ Architecture

### Services
- **MongoDB**: Database (port 27017)
- **Backend**: Node.js API (port 5000)
- **Frontend**: Next.js app (port 3000)
- **Nginx**: Reverse proxy (ports 80, 443) - Optional

### Network
All services communicate via `durga-art-network` bridge network.

### Volumes
- `mongodb_data`: Persistent MongoDB data
- `backend/logs`: Application logs

## 🛠️ Development Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Rebuild Services
```bash
docker-compose build --no-cache
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Access Containers
```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh

# MongoDB container
docker-compose exec mongodb mongosh
```

## 🔄 Production Deployment

### Environment Variables
Create production `.env` file:
```env
NODE_ENV=production
MONGODB_URI=mongodb://user:pass@prod-mongo:27017/durga_art_zone
JWT_SECRET=your-production-secret
RAZORPAY_KEY_ID=prod-key-id
RAZORPAY_KEY_SECRET=prod-key-secret
```

### SSL Configuration
1. Place SSL certificates in `nginx/ssl/`
2. Update `nginx/nginx.conf` for SSL
3. Restart nginx service

### Scaling
```bash
# Scale backend
docker-compose up -d --scale backend=3

# Scale frontend
docker-compose up -d --scale frontend=2
```

## 🐛 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
netstat -tulpn | grep :27017

# Kill processes
sudo kill -9 <PID>
```

#### Container Won't Start
```bash
# Check logs
docker-compose logs service-name

# Inspect container
docker-compose ps
docker inspect container-name
```

#### Database Connection Issues
```bash
# Check MongoDB status
docker-compose exec mongodb mongosh --eval "db.adminCommand('ismaster')"

# Reset database
docker-compose down -v
docker-compose up -d
```

#### Permission Issues (Linux)
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
sudo chmod -R 755 .
```

### Health Checks
```bash
# Check service health
curl http://localhost:5000/api/v1
curl http://localhost:3000

# Container health
docker-compose ps
```

## 📊 Monitoring

### Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Clean up unused images
docker system prune -a
```

### Logs Management
```bash
# Rotate logs
docker-compose logs --tail=1000 > app.log

# Clear logs
docker-compose down
docker-compose up -d
```

## 🔧 Customization

### Adding New Services
1. Update `docker-compose.yml`
2. Create Dockerfile
3. Add to network
4. Update environment variables

### Custom Nginx Config
Edit `nginx/nginx.conf`:
```nginx
upstream backend {
    server backend:5000;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name localhost;
    
    location /api/ {
        proxy_pass http://backend;
    }
    
    location / {
        proxy_pass http://frontend;
    }
}
```

## 🚀 Production Best Practices

1. **Use secrets management** for sensitive data
2. **Enable SSL/TLS** for all services
3. **Set up monitoring** and alerting
4. **Configure backups** for database
5. **Use orchestration** (Kubernetes) for large scale
6. **Implement CI/CD** pipeline
7. **Security scanning** of images
8. **Resource limits** for containers

## 📞 Support

If you encounter issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Check port availability
4. Ensure Docker is running
5. Review this documentation

**🎉 Happy Dockering!**
