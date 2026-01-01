# Authentication Troubleshooting Guide

## Common Issues and Solutions

### ❌ 400 Bad Request on `/auth/me`

**Possible Causes:**

1. **Token Format Issue**
   - ❌ Wrong: `Authorization: YOUR_TOKEN_HERE`
   - ✅ Correct: `Authorization: Bearer YOUR_TOKEN_HERE`
   - Make sure there's a **space** after "Bearer"

2. **Invalid Token**
   - Token might be expired
   - Token might be corrupted (copy-paste issues)
   - Solution: Get a new token by logging in again

3. **JWT Secret Not Set**
   - Check your `.env` file has `JWT_SECRET` set
   - Solution: Generate a secret and add it to `.env`

4. **Invalid User ID in Token**
   - Token was generated before user was saved to database
   - Solution: Register/login again to get a fresh token

---

## ✅ Correct Postman Setup

### Step 1: Get Token (Login or Register)

**Register:**
- POST `http://localhost:5000/api/v1/auth/register`
- Body: `{ "name": "Test", "email": "test@test.com", "password": "password123" }`
- Copy the `token` from response

**Login:**
- POST `http://localhost:5000/api/v1/auth/login`
- Body: `{ "email": "test@test.com", "password": "password123" }`
- Copy the `token` from response

### Step 2: Use Token in Protected Routes

**Method 1: Authorization Header (Recommended)**

1. Go to **Headers** tab
2. Add header:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 
   - (Replace with your actual token)

**Method 2: Authorization Tab (Easier)**

1. Go to **Authorization** tab
2. Type: Select **Bearer Token**
3. Token: Paste your token (without "Bearer" - Postman adds it automatically)

---

## 🔍 Debug Steps

### Step 1: Verify Token Format

Your token should look like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWJjZGVmMTIzNDU2Nzg5MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA1MjM0NTY3LCJleHAiOjE3MDU4MzkzNjd9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

It has **3 parts** separated by dots (`.`)

### Step 2: Test Token Validation (Development Only)

Use the debug endpoint:
- GET `http://localhost:5000/api/v1/auth/validate-token`
- Add `Authorization: Bearer YOUR_TOKEN`

This will tell you if the token is valid.

### Step 3: Check Server Console

Look at your server console when making the request. You might see:
- Token validation errors
- Database connection issues
- User lookup errors

---

## 🧪 Test Checklist

1. ✅ Server is running (`http://localhost:5000/health` works)
2. ✅ JWT_SECRET is set in `.env` file
3. ✅ You have a valid token (from login/register)
4. ✅ Token is in correct format: `Bearer <token>`
5. ✅ No extra spaces or quotes around token
6. ✅ User exists in database (check MongoDB Atlas)

---

## 🐛 Common Error Messages

### "Not authorized to access this route"
- **Cause**: Token missing or invalid
- **Fix**: Check Authorization header format

### "Invalid token format"
- **Cause**: Token payload doesn't have user ID
- **Fix**: Get a new token by logging in

### "User not found"
- **Cause**: User was deleted or token is for non-existent user
- **Fix**: Register/login again

### "Token has expired"
- **Cause**: Token expired (default: 7 days)
- **Fix**: Login again to get new token

### "Server configuration error: JWT secret not set"
- **Cause**: Missing JWT_SECRET in `.env`
- **Fix**: Add `JWT_SECRET=your-secret-here` to `.env` file

---

## 💡 Quick Fixes

### Fix 1: Reset Everything
```bash
# 1. Make sure JWT_SECRET is in .env
# 2. Restart server
# 3. Register a new user
# 4. Use the new token
```

### Fix 2: Verify Environment
```bash
# Check if JWT_SECRET is loaded
# In server.js, temporarily add:
console.log('JWT Secret:', config.jwt.secret ? 'Set' : 'NOT SET');
```

### Fix 3: Test Token Manually
```javascript
// In Node.js console
const jwt = require('jsonwebtoken');
const token = 'YOUR_TOKEN_HERE';
const secret = 'YOUR_JWT_SECRET';
try {
  const decoded = jwt.verify(token, secret);
  console.log('Token valid:', decoded);
} catch (error) {
  console.log('Token invalid:', error.message);
}
```

---

## 📝 Example Postman Request (Correct Format)

```
GET http://localhost:5000/api/v1/auth/me
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWJjZGVmMTIzNDU2Nzg5MCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA1MjM0NTY3LCJleHAiOjE3MDU4MzkzNjd9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Expected Response (200):
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "...",
    "name": "Test User",
    "email": "test@test.com",
    ...
  }
}
```

---

**If you're still getting errors, share:**
1. The exact error message
2. Your Authorization header value (mask the token)
3. Server console output


