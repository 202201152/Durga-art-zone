# Google OAuth Setup Instructions

## 🚀 Quick Setup Guide

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
5. Select **Web application**
6. Add these **Authorized redirect URIs**:
   ```
   http://localhost:5000/api/v1/auth/google/callback
   ```
7. Copy **Client ID** and **Client Secret**

### 2. Update Environment Variables

Add to your `.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
```

### 3. Enable Google+ API

1. Go to **APIs & Services** → **Library**
2. Search for **Google+ API**
3. Click **Enable**

### 4. Restart Backend Server

```bash
npm run dev
```

You should see: `✅ Google OAuth configured`

## 🔄 Google OAuth Flow

### Frontend Integration (Already Done)
The frontend should redirect users to:
```
http://localhost:5000/api/v1/auth/google
```

### Backend Flow
1. User clicks "Login with Google"
2. Redirects to Google OAuth consent screen
3. Google redirects to `/api/v1/auth/google/callback`
4. Backend creates/updates user account
5. Redirects to frontend with JWT token: 
   ```
   http://localhost:3000/auth/callback?token=jwt-token-here
   ```

## 📱 Testing

1. Start backend server
2. Visit frontend login page
3. Click "Login with Google"
4. Complete Google OAuth flow
5. Should be logged in successfully

## 🔧 Features Included

- ✅ **Auto-account creation** for new Google users
- ✅ **Account linking** for existing users with same email
- ✅ **Email verification** automatically set to true
- ✅ **Profile picture** import from Google
- ✅ **JWT token generation** for session management
- ✅ **Error handling** with proper redirects

## 🛡️ Security Notes

- Google OAuth users don't need passwords
- Email is automatically verified
- Can't change email for Google-authenticated accounts
- Secure session management with JWT tokens
