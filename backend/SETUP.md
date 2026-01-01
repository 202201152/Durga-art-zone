# Backend Setup Instructions

## Step 1: Create .env file

Copy the example file:
```bash
cp .env.example .env
```

## Step 2: Configure MongoDB

Your MongoDB connection string:
```
mongodb+srv://raganpatel648:ragan1234@cluster0.bs78a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Important**: Add database name before the `?`. Use this format:

```
mongodb+srv://raganpatel648:ragan1234@cluster0.bs78a.mongodb.net/durga-art-zone?retryWrites=true&w=majority&appName=Cluster0
```

## Step 3: Add to .env file

Open `backend/.env` and add:

```env
MONGODB_URI=mongodb+srv://raganpatel648:ragan1234@cluster0.bs78a.mongodb.net/durga-art-zone?retryWrites=true&w=majority&appName=Cluster0
```

## Step 4: Generate JWT Secret

Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add it to `.env`:
```env
JWT_SECRET=<paste-generated-secret-here>
```

## Step 5: Complete .env file

Your `.env` file should look like:

```env
NODE_ENV=development
PORT=5000
API_VERSION=v1

MONGODB_URI=mongodb+srv://raganpatel648:ragan1234@cluster0.bs78a.mongodb.net/durga-art-zone?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=your-generated-secret-here
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:3000

ENABLED_FEATURES=cart,checkout,razorpay,cod,google-auth
```

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Start Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.bs78a.mongodb.net
🚀 Server running in development mode on port 5000
```

## ⚠️ Important Notes

1. **MongoDB Atlas is Cloud-Based**: You don't need to "keep it open" - it runs 24/7 in the cloud
2. **Database Name**: We're using `durga-art-zone` as the database name. MongoDB will create it automatically when you first connect
3. **Security**: Never commit `.env` file to Git (it's already in .gitignore)

## 🔍 Troubleshooting

**Connection fails?**
- Check MongoDB Atlas → Network Access → Ensure your IP is whitelisted (or use 0.0.0.0/0 for development)
- Verify username/password are correct
- Ensure cluster is not paused (free tier clusters pause after inactivity)

**Port already in use?**
- Change `PORT=5000` to another port (e.g., `PORT=5001`)


