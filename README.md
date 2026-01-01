# Durga Art Zone - Premium Jewelry E-commerce Platform

A production-grade, scalable jewelry e-commerce platform built with modern web technologies.

## 🏗️ Architecture Overview

This project follows a **clean separation** between frontend and backend:

- **Frontend**: Next.js 14 (React) hosted on Vercel
- **Backend**: Node.js + Express hosted on AWS
- **Database**: MongoDB Atlas
- **Authentication**: JWT + Google OAuth 2.0
- **Payments**: Razorpay + Cash on Delivery

## 📁 Project Structure

```
Durga-art-zone/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
└── README.md          # This file
```

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

## 📚 Documentation

- [Backend README](./backend/README.md) - Backend API documentation
- [Frontend README](./frontend/README.md) - Frontend documentation

## 🎯 Key Features

### Implemented ✅
- Project structure and scaffolding
- Backend API foundation with Express
- Frontend foundation with Next.js
- Database connection setup
- Authentication middleware (JWT)
- Role-Based Access Control (RBAC)
- Feature flags infrastructure
- API versioning structure
- Security middleware (Helmet, CORS, Rate Limiting)
- Error handling

### To Be Built (Module by Module) 📋
- User Authentication (Signup/Login with JWT + Google OAuth)
- Product Management (CRUD operations)
- Shopping Cart
- Checkout & Payments (Razorpay + COD)
- Order Management
- Admin Dashboard
- Delivery Partner Dashboard
- User Profile Management

## 🔐 User Roles

1. **USER** - Browse, cart, checkout, view orders
2. **ADMIN** - Full platform management
3. **DELIVERY PARTNER** - Order delivery management

## 🛠️ Development Approach

This project follows **Agile methodology**:
- Features are built module by module
- Each module is production-ready before moving to next
- Code is designed for easy modification after deployment
- Feature flags allow enabling/disabling features without redeployment

## 🔄 Feature Flags

Features can be enabled/disabled via environment variables:
```env
ENABLED_FEATURES=cart,checkout,razorpay,cod,google-auth
```

This allows:
- Gradual feature rollouts
- Quick rollback if issues occur
- A/B testing capabilities
- Safe deployment of new features

## 🚢 Deployment Strategy

### Backend (AWS)
- Deploy to EC2 or Elastic Beanstalk
- Environment variables via AWS Systems Manager
- Database: MongoDB Atlas (managed)

### Frontend (Vercel)
- Automatic deployment on git push
- Environment variables configured in Vercel dashboard
- Preview deployments for PRs

### Rollback Strategy
1. **Backend**: Use feature flags to disable problematic features
2. **Frontend**: Vercel allows instant rollback to previous deployment
3. **Database**: MongoDB Atlas provides point-in-time recovery

## 📝 Environment Variables

See individual README files in `frontend/` and `backend/` directories for required environment variables.

## 🔒 Security Best Practices

- JWT tokens with secure expiration
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Helmet.js security headers
- CORS configuration
- Input validation
- SQL injection prevention (Mongoose)
- XSS protection

## 📈 Scalability

The architecture supports horizontal scaling:
- Stateless API design
- MongoDB Atlas auto-scaling
- CDN for static assets (Vercel)
- Load balancing ready (AWS)

## 🤝 Contributing

This is a private project. Follow the module-by-module development approach.

## 📄 License

Private - All rights reserved

---

**Built with ❤️ for premium jewelry e-commerce**


