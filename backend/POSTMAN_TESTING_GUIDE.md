# Postman Testing Guide - Authentication API

This guide will help you test all authentication endpoints using Postman.

## 📋 Prerequisites

1. **Server Running**: Make sure your backend server is running on `http://localhost:5000`
2. **Postman Installed**: You mentioned you have Postman ready
3. **Base URL**: `http://localhost:5000/api/v1/auth`

---

## 🧪 Test Sequence

Follow these tests in order, as some depend on previous steps.

---

## Test 1: Health Check (Optional but Recommended)

**Purpose**: Verify server is running

1. **Method**: `GET`
2. **URL**: `http://localhost:5000/health`
3. **Headers**: None needed
4. **Body**: None

**Expected Response (200)**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

✅ **If successful**: Server is running correctly!

---

## Test 2: Register New User

**Purpose**: Create a new user account

1. **Method**: `POST`
2. **URL**: `http://localhost:5000/api/v1/auth/register`
3. **Headers**:
   - `Content-Type: application/json`
4. **Body** (raw JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

**Expected Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "role": "user"
  }
}
```

✅ **Important**: Copy the `token` from response - you'll need it for protected routes!

---

## Test 3: Try Registering Duplicate Email (Error Test)

**Purpose**: Verify duplicate email prevention

1. **Method**: `POST`
2. **URL**: `http://localhost:5000/api/v1/auth/register`
3. **Headers**: `Content-Type: application/json`
4. **Body**: Same as Test 2 (same email)

**Expected Response (400)**:
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

✅ **If successful**: Validation is working!

---

## Test 4: Test Validation Errors

**Purpose**: Verify input validation works

1. **Method**: `POST`
2. **URL**: `http://localhost:5000/api/v1/auth/register`
3. **Headers**: `Content-Type: application/json`
4. **Body** (invalid data):
```json
{
  "name": "A",
  "email": "invalid-email",
  "password": "123"
}
```

**Expected Response (400)**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name must be between 2 and 50 characters"
    },
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

✅ **If successful**: Validation middleware is working!

---

## Test 5: Login with Valid Credentials

**Purpose**: Authenticate and get token

1. **Method**: `POST`
2. **URL**: `http://localhost:5000/api/v1/auth/login`
3. **Headers**: `Content-Type: application/json`
4. **Body**:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "role": "user",
    "profilePicture": null
  }
}
```

✅ **Important**: Copy this token too - it should be the same or different from registration token.

---

## Test 6: Login with Wrong Password (Error Test)

**Purpose**: Verify authentication security

1. **Method**: `POST`
2. **URL**: `http://localhost:5000/api/v1/auth/login`
3. **Headers**: `Content-Type: application/json`
4. **Body**:
```json
{
  "email": "test@example.com",
  "password": "wrongpassword"
}
```

**Expected Response (401)**:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

✅ **If successful**: Security is working!

---

## Test 7: Get Current User (Protected Route)

**Purpose**: Test JWT token authentication

1. **Method**: `GET`
2. **URL**: `http://localhost:5000/api/v1/auth/me`
3. **Headers**:
   - `Authorization: Bearer YOUR_TOKEN_HERE`
   - (Replace `YOUR_TOKEN_HERE` with the token from Test 5)

**Expected Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "role": "user",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

✅ **If successful**: JWT authentication is working!

---

## Test 8: Get Current User Without Token (Error Test)

**Purpose**: Verify protected routes reject unauthorized requests

1. **Method**: `GET`
2. **URL**: `http://localhost:5000/api/v1/auth/me`
3. **Headers**: None (or remove Authorization header)

**Expected Response (401)**:
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

✅ **If successful**: Protection middleware is working!

---

## Test 9: Get Current User with Invalid Token (Error Test)

**Purpose**: Verify token validation

1. **Method**: `GET`
2. **URL**: `http://localhost:5000/api/v1/auth/me`
3. **Headers**:
   - `Authorization: Bearer invalid_token_here`

**Expected Response (401)**:
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

✅ **If successful**: Token validation is working!

---

## Test 10: Update User Details

**Purpose**: Test updating user profile

1. **Method**: `PUT`
2. **URL**: `http://localhost:5000/api/v1/auth/updatedetails`
3. **Headers**:
   - `Authorization: Bearer YOUR_TOKEN_HERE`
   - `Content-Type: application/json`
4. **Body**:
```json
{
  "name": "Updated Name",
  "phone": "9876543210"
}
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Details updated successfully",
  "data": {
    "_id": "...",
    "name": "Updated Name",
    "email": "test@example.com",
    "phone": "9876543210",
    ...
  }
}
```

✅ **If successful**: Update functionality works!

---

## Test 11: Update Password

**Purpose**: Test password change functionality

1. **Method**: `PUT`
2. **URL**: `http://localhost:5000/api/v1/auth/updatepassword`
3. **Headers**:
   - `Authorization: Bearer YOUR_TOKEN_HERE`
   - `Content-Type: application/json`
4. **Body**:
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Password updated successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // New token
}
```

✅ **Important**: You'll get a new token - use this for subsequent requests!

---

## Test 12: Login with New Password

**Purpose**: Verify password was actually changed

1. **Method**: `POST`
2. **URL**: `http://localhost:5000/api/v1/auth/login`
3. **Headers**: `Content-Type: application/json`
4. **Body**:
```json
{
  "email": "test@example.com",
  "password": "newpassword123"
}
```

**Expected Response (200)**: Should work with new password ✅

**Test with old password**:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response (401)**: Should fail ✅

---

## Test 13: Forgot Password (Development Mode)

**Purpose**: Test password reset request

1. **Method**: `POST`
2. **URL**: `http://localhost:5000/api/v1/auth/forgotpassword`
3. **Headers**: `Content-Type: application/json`
4. **Body**:
```json
{
  "email": "test@example.com"
}
```

**Expected Response (200)** - Development:
```json
{
  "success": true,
  "message": "Password reset token generated",
  "resetToken": "abc123def456...",
  "resetUrl": "http://localhost:5000/api/v1/auth/resetpassword/abc123def456..."
}
```

✅ **Important**: Copy the `resetToken` for Test 14!

---

## Test 14: Reset Password

**Purpose**: Test password reset with token

1. **Method**: `PUT`
2. **URL**: `http://localhost:5000/api/v1/auth/resetpassword/YOUR_RESET_TOKEN`
   - Replace `YOUR_RESET_TOKEN` with token from Test 13
3. **Headers**: `Content-Type: application/json`
4. **Body**:
```json
{
  "password": "resetpassword123"
}
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Password reset successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

✅ **Note**: Token expires after 10 minutes!

---

## Test 15: Logout

**Purpose**: Test logout endpoint (mainly client-side in JWT)

1. **Method**: `POST`
2. **URL**: `http://localhost:5000/api/v1/auth/logout`
3. **Headers**:
   - `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🔥 Postman Tips

### Create an Environment Variable

1. In Postman, click **Environments** → **+**
2. Name it "Local Development"
3. Add variable:
   - Variable: `baseUrl`
   - Initial Value: `http://localhost:5000/api/v1`
4. Add variable:
   - Variable: `token`
   - Initial Value: (leave empty, will be set from responses)
5. Save

Now use: `{{baseUrl}}/auth/login` instead of full URL!

### Auto-Save Token

1. After login/register, add this to **Tests** tab:
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    var jsonData = pm.response.json();
    if (jsonData.token) {
        pm.environment.set("token", jsonData.token);
    }
}
```

2. In **Authorization** tab, select "Bearer Token" and type: `{{token}}`

This automatically uses the saved token for protected routes!

---

## ✅ Testing Checklist

- [ ] Health check works
- [ ] User registration successful
- [ ] Duplicate email prevented
- [ ] Validation errors show correctly
- [ ] Login successful
- [ ] Wrong password rejected
- [ ] Protected route works with token
- [ ] Protected route rejects without token
- [ ] Invalid token rejected
- [ ] Update details works
- [ ] Update password works
- [ ] New password login works
- [ ] Old password rejected
- [ ] Forgot password generates token
- [ ] Reset password works
- [ ] Logout works

---

## 🐛 Troubleshooting

**401 Unauthorized**: Check if token is in `Bearer TOKEN` format (with space after Bearer)

**400 Bad Request**: Check JSON format and required fields

**500 Server Error**: Check server console for detailed error

**Connection Refused**: Make sure server is running on port 5000

---

Happy Testing! 🚀


