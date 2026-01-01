# Quick Start Guide

Get up and running with Durga Art Zone in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Git repository set up

## Step 1: Clone & Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values:
# - MONGODB_URI (from MongoDB Atlas)
# - JWT_SECRET (generate a random string)
# - Other service keys as needed
```

### Get MongoDB URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Go to Database Access → Add Database User
4. Go to Network Access → Add IP Address (0.0.0.0/0 for development)
5. Go to Database → Connect → Connect your application
6. Copy the connection string and replace `<password>` with your password

### Generate JWT Secret

```bash
# Generate a random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 2: Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: ...
🚀 Server running in development mode on port 5000
```

Test it: Visit `http://localhost:5000/health`

## Step 3: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Step 4: Start Frontend

```bash
cd frontend
npm run dev
```

Visit: `http://localhost:3000`

## ✅ Verification

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"OK",...}`

2. **Frontend Running**
   - Visit `http://localhost:3000`
   - Should see "Durga Art Zone" homepage

3. **API Connection**
   - Backend API info: `http://localhost:5000/api/v1`

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB URI is correct
- Ensure port 5000 is not in use
- Check `.env` file exists and has required variables

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in backend (should allow `http://localhost:3000`)

### MongoDB connection fails
- Verify IP address is whitelisted in MongoDB Atlas
- Check username/password in connection string
- Ensure cluster is running (not paused)

## 📝 Next Steps

Now that infrastructure is set up, you can start building features:

1. **Authentication Module** - User signup/login
2. **Products Module** - Product catalog
3. **Cart & Checkout** - Shopping flow
4. **Admin Panel** - Product management
5. **Orders** - Order management

Each module will be built following the Agile approach - one at a time, production-ready.

## 🆘 Need Help?

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
- Review backend/README.md and frontend/README.md

---

**Ready to build! 🚀**


