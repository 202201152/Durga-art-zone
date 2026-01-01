# Durga Art Zone - Backend API

Production-grade Node.js + Express backend for jewelry e-commerce platform.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT + Google OAuth 2.0
- **Payments**: Razorpay
- **Security**: Helmet, CORS, Rate Limiting
- **Deployment**: AWS (EC2/Elastic Beanstalk)

## Project Structure

```
backend/
├── config/           # Configuration files
│   ├── index.js      # Centralized config
│   └── database.js   # MongoDB connection
├── middleware/       # Express middleware
│   ├── auth.js       # JWT authentication
│   ├── rbac.js       # Role-based access control
│   ├── featureFlags.js # Feature flag checks
│   ├── errorHandler.js # Global error handler
│   └── rateLimiter.js  # Rate limiting
├── models/           # Mongoose models
│   └── User.js       # User schema
├── routes/           # API routes
│   └── index.js      # Main router
├── controllers/      # Route controllers (to be added)
├── services/         # Business logic (to be added)
├── utils/            # Utility functions (to be added)
├── server.js         # Entry point
├── package.json      # Dependencies
└── .env.example      # Environment template
```

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Start production server**
   ```bash
   npm start
   ```

## Environment Variables

See `.env.example` for all required variables.

## API Versioning

All routes are versioned under `/api/v1/`. This allows:
- Breaking changes in future versions without affecting existing clients
- Gradual migration path
- Multiple API versions running simultaneously

## Feature Flags

Features can be enabled/disabled via `ENABLED_FEATURES` environment variable:
```env
ENABLED_FEATURES=cart,checkout,razorpay,cod,google-auth
```

Use the `checkFeatureFlag` middleware in routes to gate features.

## Security Features

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Helmet security headers
- CORS configuration
- Input validation (express-validator)

## Deployment

See deployment documentation for AWS setup instructions.


