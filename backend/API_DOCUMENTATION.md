# Authentication API Documentation

## Base URL
```
http://localhost:5000/api/v1/auth
```

## Authentication Endpoints

### 1. Register New User

**Endpoint:** `POST /api/v1/auth/register`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890" // Optional
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "user"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

---

### 2. Login User

**Endpoint:** `POST /api/v1/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "user",
    "profilePicture": null
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User

**Endpoint:** `GET /api/v1/auth/me`

**Access:** Private (Requires Authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

### 4. Logout User

**Endpoint:** `POST /api/v1/auth/logout`

**Access:** Private (Requires Authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Note:** Since we're using JWT tokens, logout is primarily handled client-side by removing the token.

---

### 5. Update User Details

**Endpoint:** `PUT /api/v1/auth/updatedetails`

**Access:** Private (Requires Authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (all fields optional):**
```json
{
  "name": "John Updated",
  "email": "newemail@example.com",
  "phone": "9876543210"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Details updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "newemail@example.com",
    "phone": "9876543210"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cannot update email for Google-authenticated accounts"
}
```

---

### 6. Update Password

**Endpoint:** `PUT /api/v1/auth/updatepassword`

**Access:** Private (Requires Authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // New token
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### 7. Forgot Password

**Endpoint:** `POST /api/v1/auth/forgotpassword`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200) - Development:**
```json
{
  "success": true,
  "message": "Password reset token generated",
  "resetToken": "abc123def456...",
  "resetUrl": "http://localhost:5000/api/v1/auth/resetpassword/abc123def456..."
}
```

**Success Response (200) - Production:**
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent"
}
```

---

### 8. Reset Password

**Endpoint:** `PUT /api/v1/auth/resetpassword/:resettoken`

**Access:** Public

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

---

### 9. Google OAuth Login

**Endpoint:** `GET /api/v1/auth/google`

**Access:** Public

**Description:** Initiates Google OAuth flow. User will be redirected to Google login page.

**Success:** Redirects to Google OAuth consent screen, then to callback URL.

**Note:** Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to be configured in environment variables.

---

### 10. Google OAuth Callback

**Endpoint:** `GET /api/v1/auth/google/callback`

**Access:** Public

**Description:** Google OAuth callback handler. Automatically handles user creation/login and redirects to frontend with token.

**Success:** Redirects to `FRONTEND_URL/auth/callback?token=<jwt_token>`

---

## Error Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors, invalid input)
- **401**: Unauthorized (invalid token, wrong credentials)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Server Error

## Rate Limiting

Authentication endpoints have stricter rate limiting:
- **Auth endpoints**: 5 requests per 15 minutes per IP
- **General API**: 100 requests per 15 minutes per IP

## Security Notes

1. **JWT Tokens**: Tokens expire after 7 days (configurable via `JWT_EXPIRE`)
2. **Password Hashing**: All passwords are hashed using bcrypt before storage
3. **Email Verification**: Google OAuth users are automatically verified
4. **Account Status**: Inactive accounts cannot login
5. **Password Reset**: Reset tokens expire after 10 minutes

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**For more information, see the main README.md**


