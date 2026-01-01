# Architecture & Design Decisions

This document explains the architectural decisions and design patterns used in Durga Art Zone.

## 🏗️ System Architecture

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│   Frontend      │ ◄──────►│   Backend API   │
│   (Next.js)     │  HTTPS  │   (Express)     │
│   Vercel        │         │   AWS           │
│                 │         │                 │
└─────────────────┘         └────────┬────────┘
                                     │
                                     │
                            ┌────────▼────────┐
                            │                 │
                            │  MongoDB Atlas  │
                            │  (Database)     │
                            │                 │
                            └─────────────────┘
```

## 🎯 Design Principles

### 1. Separation of Concerns
- **Frontend**: Handles UI, user interactions, and client-side state
- **Backend**: Handles business logic, data validation, and API endpoints
- **Database**: Stores and manages data

### 2. Modular Architecture
- Each feature is a self-contained module
- Modules can be added/removed without affecting others
- Clear boundaries between modules

### 3. API-First Design
- Backend APIs are designed to be consumed by multiple clients (web, mobile in future)
- RESTful principles with versioning support
- Consistent response formats

### 4. Scalability
- Stateless API design (enables horizontal scaling)
- Database connection pooling
- CDN-ready static assets

## 📁 Project Structure Explanation

### Backend Structure

```
backend/
├── config/              # Configuration management
│   ├── index.js        # Centralized config (single source of truth)
│   ├── database.js     # Database connection logic
│   └── featureFlags.js # Feature flag definitions
│
├── middleware/          # Express middleware
│   ├── auth.js         # JWT authentication
│   ├── rbac.js         # Role-based access control
│   ├── featureFlags.js # Feature flag checks
│   ├── errorHandler.js # Global error handling
│   └── rateLimiter.js  # Rate limiting
│
├── models/             # Mongoose schemas
│   └── User.js         # User model (others to be added)
│
├── routes/             # API route definitions
│   └── index.js        # Main router with versioning
│
├── controllers/        # Route handlers (to be added)
├── services/           # Business logic (to be added)
└── utils/              # Utility functions
```

**Why this structure?**
- **Config folder**: Centralizes all configuration, makes it easy to change environments
- **Middleware**: Reusable across all routes, keeps route handlers clean
- **Models**: Database schemas in one place
- **Routes/Controllers/Services**: Separation allows for easy testing and modification

### Frontend Structure

```
frontend/
├── app/                # Next.js App Router
│   ├── layout.tsx     # Root layout with providers
│   ├── page.tsx       # Home page
│   └── globals.css    # Global styles
│
├── components/         # React components
│   └── providers/     # Context providers (React Query, etc.)
│
├── lib/                # Utilities and helpers
│   ├── api/           # API client configuration
│   └── features/      # Feature flag utilities
│
└── public/             # Static assets
```

**Why this structure?**
- **App Router**: Next.js 14's modern routing (better than Pages Router)
- **Components**: Reusable UI components
- **Lib**: Shared utilities and API client
- **Separation**: Clear separation of concerns

## 🔐 Authentication Flow

### JWT Authentication

```
1. User submits credentials
   ↓
2. Backend validates credentials
   ↓
3. Backend generates JWT token
   ↓
4. Frontend stores token (cookie/localStorage)
   ↓
5. Frontend sends token with each request (Authorization header)
   ↓
6. Backend middleware verifies token
   ↓
7. Request proceeds if valid
```

**Why JWT?**
- Stateless (no server-side session storage needed)
- Scalable (works across multiple servers)
- Secure (signed tokens)
- Contains user info (reduces database queries)

### Google OAuth Flow

```
1. User clicks "Sign in with Google"
   ↓
2. Redirect to Google OAuth consent screen
   ↓
3. User grants permission
   ↓
4. Google redirects back with authorization code
   ↓
5. Backend exchanges code for user info
   ↓
6. Backend creates/updates user and generates JWT
   ↓
7. Frontend receives token and stores it
```

## 🛡️ Security Measures

### 1. Password Security
- **Bcrypt hashing**: Passwords are hashed with salt before storage
- **Never stored in plain text**: Even we can't see user passwords

### 2. API Security
- **Rate limiting**: Prevents brute force attacks
- **Helmet.js**: Security headers (XSS protection, etc.)
- **CORS**: Restricts which domains can access API
- **Input validation**: Prevents injection attacks

### 3. Token Security
- **Short expiration**: Tokens expire after 7 days
- **HTTPS only**: Tokens sent only over encrypted connections
- **HttpOnly cookies**: (Can be implemented) Prevents XSS token theft

## 🔄 Feature Flags System

### How It Works

1. **Configuration**: Features listed in `ENABLED_FEATURES` environment variable
2. **Backend Check**: Middleware checks if feature is enabled before allowing access
3. **Frontend Check**: Frontend checks feature flags to conditionally render UI

### Benefits

- **Safe Rollouts**: Enable features gradually
- **Quick Rollback**: Disable problematic features instantly
- **A/B Testing**: Enable for some users, disable for others
- **Zero Downtime**: No code deployment needed to toggle features

### Example

```env
# Enable checkout and Razorpay
ENABLED_FEATURES=cart,checkout,razorpay,cod

# Disable Razorpay if issues occur
ENABLED_FEATURES=cart,checkout,cod
```

## 📊 API Versioning Strategy

### Why Version?
- Allows breaking changes without breaking existing clients
- Multiple versions can run simultaneously
- Gradual migration path

### Current Structure

```
/api/v1/products     # Version 1 (current)
/api/v2/products     # Version 2 (future, if needed)
```

### Best Practices

- **v1 is default**: All current routes use v1
- **Backward compatible**: New versions should maintain old endpoints when possible
- **Documentation**: Each version should have clear documentation

## 🗄️ Database Design Philosophy

### MongoDB Choice

**Why MongoDB?**
- **Flexible schema**: Easy to add/modify fields (perfect for Agile)
- **JSON-like documents**: Matches our API structure
- **Scalable**: MongoDB Atlas handles scaling automatically
- **Rich queries**: Supports complex queries we'll need

### Schema Design Principles

1. **Embed vs Reference**
   - **Embed**: Small, rarely changing data (user address)
   - **Reference**: Large collections or frequently changing data (products, orders)

2. **Indexing**
   - Index frequently queried fields (email, product ID)
   - Improves query performance

3. **Timestamps**
   - All schemas include `createdAt` and `updatedAt` (via Mongoose timestamps)

## 🚀 Deployment Strategy

### Why Separate Hosts?

- **Frontend (Vercel)**: Optimized for Next.js, automatic deployments, CDN
- **Backend (AWS)**: Full control, scalable, cost-effective at scale
- **Database (Atlas)**: Managed MongoDB, backups, scaling handled

### Deployment Flow

```
1. Code pushed to Git
   ↓
2. Backend deployed to AWS (manual or CI/CD)
   ↓
3. Frontend automatically deployed to Vercel
   ↓
4. Both connect to MongoDB Atlas
```

## 🔄 Post-Deployment Modifications

### How We Enable Easy Changes

1. **Feature Flags**: Toggle features without code changes
2. **Environment Variables**: Configure without redeployment
3. **Modular Code**: Change one module without affecting others
4. **API Versioning**: Add new endpoints without breaking old ones

### Example: Adding a New Feature

```
1. Develop feature in new branch
2. Add feature flag
3. Deploy backend with feature flag disabled
4. Deploy frontend
5. Enable feature flag when ready
6. Monitor, disable if issues
```

## 📈 Scaling Considerations

### Horizontal Scaling (Adding More Servers)

**Backend:**
- Stateless design allows multiple instances
- Load balancer distributes requests
- All instances connect to same MongoDB

**Frontend:**
- Vercel handles scaling automatically
- CDN caches static assets globally

### Vertical Scaling (Better Hardware)

- MongoDB Atlas can upgrade instance size
- AWS can upgrade EC2 instance
- Usually easier but more expensive

## 🔍 Monitoring & Observability

### What to Monitor

1. **API Response Times**: Slow endpoints indicate issues
2. **Error Rates**: High errors indicate problems
3. **Database Queries**: Slow queries need optimization
4. **Feature Flag Usage**: Track which features are used

### Tools (To Be Implemented)

- **Backend**: AWS CloudWatch, custom logging
- **Frontend**: Vercel Analytics, browser console
- **Database**: MongoDB Atlas Monitoring

---

**This architecture is designed to grow with your business while remaining maintainable and scalable.**


