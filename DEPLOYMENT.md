# Deployment Guide

This document outlines the deployment strategy for Durga Art Zone.

## 🎯 Deployment Strategy

Our deployment follows a **safe, rollback-ready** approach with feature flags as the primary safety mechanism.

## 📦 Backend Deployment (AWS)

### Option 1: AWS Elastic Beanstalk (Recommended for Start)

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   cd backend
   eb init -p node.js durga-art-zone-backend
   ```

3. **Create Environment**
   ```bash
   eb create durga-art-zone-prod
   ```

4. **Set Environment Variables**
   ```bash
   eb setenv MONGODB_URI=xxx JWT_SECRET=xxx ...
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

### Option 2: AWS EC2 (More Control)

1. **Launch EC2 Instance** (Ubuntu 22.04 LTS)
2. **Install Node.js 18+**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2** (Process Manager)
   ```bash
   npm install -g pm2
   ```

4. **Clone Repository**
   ```bash
   git clone <your-repo>
   cd Durga-art-zone/backend
   npm install --production
   ```

5. **Configure Environment Variables**
   ```bash
   # Use AWS Systems Manager Parameter Store or .env file
   sudo nano .env
   ```

6. **Start Application**
   ```bash
   pm2 start server.js --name durga-backend
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx** (Reverse Proxy)
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🌐 Frontend Deployment (Vercel)

### Automatic Deployment

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Select the `frontend` folder as root directory

2. **Configure Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all `NEXT_PUBLIC_*` variables from `.env.example`

3. **Deploy**
   - Vercel automatically deploys on every push to `main`
   - Preview deployments are created for pull requests

### Manual Deployment

```bash
cd frontend
npm install
npm run build
vercel --prod
```

## 🔄 Safe Deployment Process

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backups created
- [ ] Feature flags set correctly
- [ ] Tests passing (when tests are added)
- [ ] API documentation updated

### Deployment Steps

1. **Deploy Backend First**
   ```bash
   # Test locally
   npm run dev
   
   # Deploy to staging (if you have staging environment)
   eb deploy durga-art-zone-staging
   
   # Test staging
   # If successful, deploy to production
   eb deploy durga-art-zone-prod
   ```

2. **Verify Backend**
   - Check health endpoint: `https://api.yourdomain.com/health`
   - Test API endpoints
   - Monitor logs: `eb logs` or `pm2 logs`

3. **Deploy Frontend**
   - Push to `main` branch (triggers Vercel deployment)
   - Or use Vercel CLI: `vercel --prod`

4. **Verify Frontend**
   - Test user flows
   - Check browser console for errors
   - Verify API connections

## 🚨 Rollback Strategy

### Backend Rollback

**Option 1: Feature Flags (Recommended)**
```bash
# Disable problematic feature via environment variable
eb setenv ENABLED_FEATURES=cart,checkout,cod
# (Remove problematic feature from list)
```

**Option 2: EB Version Rollback**
```bash
eb list
eb use durga-art-zone-prod
eb deploy <previous-version-label>
```

**Option 3: PM2 Rollback (EC2)**
```bash
pm2 list
pm2 restart durga-backend --update-env
# Or revert to previous code version via Git
```

### Frontend Rollback

**Vercel Dashboard:**
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

**Vercel CLI:**
```bash
vercel rollback
```

## 🔍 Monitoring & Logs

### Backend Logs

**Elastic Beanstalk:**
```bash
eb logs
```

**PM2 (EC2):**
```bash
pm2 logs durga-backend
pm2 monit
```

### Frontend Logs

- Vercel dashboard → Deployment → Functions tab
- Browser console (client-side errors)

## 🔐 Environment Variables Setup

### Backend (AWS)

**Elastic Beanstalk:**
```bash
eb setenv \
  NODE_ENV=production \
  MONGODB_URI=mongodb+srv://... \
  JWT_SECRET=xxx \
  RAZORPAY_KEY_ID=xxx \
  RAZORPAY_KEY_SECRET=xxx \
  ...
```

**EC2 (Systems Manager Parameter Store):**
```bash
aws ssm put-parameter --name /durga-art-zone/MONGODB_URI --value "xxx" --type SecureString
```

### Frontend (Vercel)

Add in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

## 🌍 Domain Setup

### Backend API Domain

1. **Get IP/Elastic IP from AWS**
2. **Add DNS A Record**:
   ```
   api.yourdomain.com → AWS IP
   ```
3. **Setup SSL** (Let's Encrypt with Certbot)

### Frontend Domain

1. **Add Domain in Vercel Dashboard**
2. **Configure DNS**:
   ```
   CNAME: www → cname.vercel-dns.com
   ```
3. **SSL is automatic** (Vercel handles it)

## 📊 Health Checks

### Backend Health Check

Endpoint: `GET /health`

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### Monitoring Tools

- **AWS CloudWatch** (for backend)
- **Vercel Analytics** (for frontend)
- **MongoDB Atlas Monitoring** (for database)

## 🚀 Zero-Downtime Deployment

1. **Backend**: Elastic Beanstalk handles zero-downtime with rolling updates
2. **Frontend**: Vercel handles zero-downtime deployments automatically
3. **Database**: MongoDB Atlas handles upgrades with minimal downtime

## ✅ Post-Deployment Verification

- [ ] Health check endpoint returns 200
- [ ] User can login
- [ ] Products load correctly
- [ ] Cart functionality works
- [ ] Payment integration tested (test mode)
- [ ] Admin panel accessible
- [ ] No console errors in browser
- [ ] API response times are acceptable

---

**Remember**: Always deploy backend first, then frontend. This ensures API is ready when frontend goes live.


