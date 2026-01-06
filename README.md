# 🛍️ Durga Art Zone - Premium Jewelry E-commerce Platform

A production-grade, scalable jewelry e-commerce platform built with modern web technologies.

## 🏗️ Architecture Overview

This project follows a **clean separation** between frontend and backend:

- **Frontend**: Next.js 14 (React) with TypeScript
- **Backend**: Node.js + Express with MongoDB
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth 2.0
- **Payments**: Razorpay + Cash on Delivery
- **Containerization**: Docker with Docker Compose
- **Deployment**: Production-ready with Nginx

## 📁 Project Structure

```
Durga-art-zone/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   ├── components/           # Reusable React components
│   ├── contexts/            # React contexts (Cart, Auth)
│   ├── lib/                # Utilities and API client
│   └── types/              # TypeScript definitions
├── backend/                  # Express.js backend API
│   ├── controllers/         # Request handlers
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   └── utils/              # Helper functions
├── scripts/                 # Docker and utility scripts
├── docker-compose.yml        # Multi-service orchestration
└── README.md               # This file
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# One-command setup
./scripts/docker-setup.ps1  # Windows
./scripts/docker-setup.sh    # Linux/Mac

# Or manual setup
docker-compose up -d
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend Setup
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
- [Docker Setup](./DOCKER_SETUP.md) - Complete Docker guide
- [Razorpay Setup](./RAZORPAY_SETUP.md) - Payment integration guide
- [Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md) - Authentication guide

## 🎯 Key Features

### ✅ Fully Implemented

#### **Authentication & Authorization**
- Email/password authentication with JWT
- Google OAuth 2.0 integration
- Role-based access control (RBAC)
- Protected routes and middleware
- User profile management

#### **Product Management**
- Product CRUD operations
- Image upload and optimization
- Product search and filtering
- Category management
- Inventory tracking

#### **Shopping Cart & Checkout**
- Add to cart functionality
- Cart persistence across sessions
- Multiple payment methods (COD, Razorpay)
- Address management
- Order processing

#### **Payment Integration**
- Razorpay payment gateway
- Credit/Debit cards, UPI, Net Banking
- Payment verification and webhooks
- Order status updates
- Success/failure handling

#### **Order Management**
- Order creation and tracking
- Order history for users
- Admin order management
- Status updates
- Delivery partner integration

#### **Admin Dashboard**
- Product management interface
- Order management system
- User management
- Sales analytics and reports
- Revenue tracking

#### **Advanced Features**
- Docker containerization
- Environment-based configuration
- Feature flags system
- API versioning
- Comprehensive error handling
- Security middleware
- Rate limiting
- Input validation

### 🔧 Technical Features

#### **Security**
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Helmet.js security headers
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection

#### **Performance**
- Image optimization
- Lazy loading
- Code splitting
- Caching strategies
- Database indexing
- API response optimization

#### **Scalability**
- Stateless API design
- Horizontal scaling ready
- Load balancing support
- Database optimization
- CDN integration ready

## � User Roles

1. **USER** - Browse products, cart management, checkout, order tracking
2. **ADMIN** - Full platform management, products, orders, users, analytics
3. **DELIVERY PARTNER** - Order delivery management, status updates

## 🛠️ Development Approach

This project follows **Agile methodology**:
- Features built module by module
- Each module is production-ready
- Code designed for easy modification
- Feature flags for gradual rollouts
- Comprehensive testing

## 🔄 Feature Flags

Features can be enabled/disabled via environment variables:
```env
ENABLED_FEATURES=cart,checkout,razorpay,cod,google-auth,email-notifications
```

Benefits:
- Gradual feature rollouts
- Quick rollback capabilities
- A/B testing support
- Safe deployment practices

## � Docker Integration

### Services Included
- **MongoDB**: Database with persistent storage
- **Backend**: Node.js API with health checks
- **Frontend**: Next.js application with optimized builds
- **Nginx**: Reverse proxy and load balancing

### Docker Features
- Multi-stage builds for optimization
- Health monitoring
- Automatic restarts
- Volume mounting for persistence
- Network isolation
- Production-ready configuration

## 🚢 Deployment Options

### Option 1: Docker (Recommended)
- Complete environment in containers
- Easy scaling and management
- Consistent across environments
- Health monitoring included

### Option 2: Traditional
- **Backend**: AWS EC2, DigitalOcean, or any VPS
- **Frontend**: Vercel, Netlify, or AWS S3
- **Database**: MongoDB Atlas or self-hosted

### Option 3: Cloud Services
- **AWS**: ECS, EKS, or Elastic Beanstalk
- **Google Cloud**: GKE or Cloud Run
- **Azure**: Container Instances or AKS

## 📝 Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/durga_art_zone

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret

# Application
FRONTEND_URL=http://localhost:3000
ENABLED_FEATURES=google-auth,email-notifications
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
```

## 🔒 Security Best Practices

- **Authentication**: Secure JWT tokens with expiration
- **Password Security**: Bcrypt hashing with salt rounds
- **API Security**: Rate limiting, CORS, Helmet headers
- **Input Validation**: Comprehensive validation on all inputs
- **Database Security**: Mongoose protection against injection
- **Frontend Security**: XSS protection, CSRF tokens
- **Environment Security**: No hardcoded secrets

## 📊 Monitoring & Analytics

### Application Monitoring
- Health checks on all services
- Error tracking and logging
- Performance metrics
- User behavior analytics

### Business Analytics
- Sales reporting
- Product performance
- Customer insights
- Revenue tracking
- Conversion analytics

## 🧪 Testing

### Backend Testing
- Unit tests with Jest
- Integration tests
- API endpoint testing
- Database operation testing

### Frontend Testing
- Component testing with React Testing Library
- End-to-end testing with Cypress
- User flow testing
- Responsive design testing

## 🤝 Contributing

This is a private project following module-by-module development:
1. Each feature is developed as a complete module
2. Code is reviewed before integration
3. Testing is comprehensive
4. Documentation is updated
5. Deployment is automated

## 📄 License

Private - All rights reserved

## 🎯 Production Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] SSL certificates installed
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Load testing completed

### Post-Deployment
- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Backup verification
- [ ] Performance monitoring active
- [ ] Error tracking enabled
- [ ] User testing completed

---

## 🚀 Getting Help

### Documentation
- [Docker Setup Guide](./DOCKER_SETUP.md)
- [Razorpay Integration](./RAZORPAY_SETUP.md)
- [Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md)
- [Backend API Docs](./backend/README.md)
- [Frontend Guide](./frontend/README.md)

### Troubleshooting
1. Check environment variables
2. Verify Docker services status
3. Review application logs
4. Check network connectivity
5. Validate database connection

---

**🛍️ Built with ❤️ for premium jewelry e-commerce**

**🐳 Production-ready with Docker containerization**

**🔒 Enterprise-grade security and scalability**

---

## 📞 Support

For technical support or questions:
1. Review the comprehensive documentation
2. Check the troubleshooting guides
3. Verify environment configuration
4. Contact the development team

**🎉 Ready for production deployment!**


