# Frontend Setup & Testing Guide

## ✅ What's Been Built

### Authentication Pages
- ✅ Login Page (`/auth/login`)
- ✅ Signup Page (`/auth/signup`)
- ✅ Forgot Password Page (`/auth/forgot-password`)
- ✅ OAuth Callback Page (`/auth/callback`)

### Components
- ✅ Auth Context (token management, user state)
- ✅ Protected Route wrapper
- ✅ Logo component
- ✅ Google OAuth button
- ✅ Integration with backend API

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

Create `.env.local` file in `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Google OAuth (optional - for Google login)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Razorpay (for future use)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id

# Environment
NEXT_PUBLIC_ENV=development
```

### Step 3: Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🧪 Testing Authentication

### Test Flow

1. **Visit Homepage**
   - Go to `http://localhost:3000`
   - Should see "Login" and "Sign Up" buttons

2. **Test Signup**
   - Click "Sign Up"
   - Fill in form: Name, Email, Password
   - Click "Create Account"
   - Should redirect to homepage with welcome message

3. **Test Login**
   - Click "Login"
   - Enter email and password
   - Click "Log In"
   - Should redirect to homepage

4. **Test Protected Routes**
   - After logging in, you should see your name and email
   - Logout button should work

5. **Test Google OAuth** (if configured)
   - Click "Continue with Google"
   - Should redirect to Google login
   - After authentication, should redirect back and log you in

---

## 🎨 Design Details

### Colors
- Primary Button: `#d4a574` (Light brown/tan)
- Background: `#faf8f5` (Light beige/off-white)
- Text: Dark gray (`#111827`)
- Input Background: White

### Components Matching Design
- ✅ Circular logo with star icon
- ✅ Clean, minimalist layout
- ✅ Rounded input fields
- ✅ Primary action buttons with tan color
- ✅ Google button with official logo
- ✅ Help icon (bottom right)

---

## 📁 File Structure

```
frontend/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   ├── signup/page.tsx         # Signup page
│   │   ├── forgot-password/page.tsx # Password reset
│   │   └── callback/page.tsx       # OAuth callback
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Homepage
├── components/
│   ├── auth/
│   │   ├── Logo.tsx                # Logo component
│   │   ├── GoogleButton.tsx        # Google OAuth button
│   │   └── ProtectedRoute.tsx      # Route protection
│   └── providers/
│       └── Providers.tsx           # Context providers
├── contexts/
│   └── AuthContext.tsx             # Authentication context
└── lib/
    └── api/
        └── client.ts               # API client
```

---

## 🔧 Usage Examples

### Using Auth Context

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This page requires authentication</div>
    </ProtectedRoute>
  );
}

// For admin-only pages
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

---

## 🐛 Troubleshooting

### "Cannot connect to API"
- Check if backend server is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### "Token expired" or redirects to login
- Token might be expired
- Try logging in again

### Google OAuth not working
- Check if `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
- Verify backend has Google OAuth configured
- Check browser console for errors

### Styles not applying
- Make sure Tailwind is configured
- Check if `globals.css` imports Tailwind
- Restart dev server

---

## ✅ Next Steps

1. **Test all pages** - Make sure everything works
2. **Style adjustments** - Fine-tune colors/spacing if needed
3. **Build more features** - Products, Cart, Orders, etc.

---

**Authentication module is complete! 🎉**

