# 🔧 Durga Art Zone - Backend API

Production-grade Node.js + Express backend for jewelry e-commerce platform with complete e-commerce functionality.

## 🏗️ Tech Stack

- **Runtime**: Node.js 18+ with Alpine Linux
- **Framework**: Express.js with comprehensive middleware
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth 2.0
- **Payments**: Razorpay + Cash on Delivery
- **Security**: Helmet, CORS, Rate Limiting, Input Validation
- **Containerization**: Docker with health checks
- **Deployment**: Production-ready with Nginx support

## 📁 Project Structure

```
backend/
├── config/               # Configuration management
│   ├── index.js          # Centralized configuration
│   ├── database.js        # MongoDB connection setup
│   └── passport.js       # Google OAuth configuration
├── controllers/          # Request handlers
│   ├── authController.js  # Authentication logic
│   ├── userController.js  # User management
│   ├── productController.js # Product CRUD
│   ├── orderController.js # Order processing
│   └── paymentController.js # Razorpay integration
├── middleware/           # Express middleware
│   ├── auth.js          # JWT authentication
│   ├── rbac.js          # Role-based access control
│   ├── featureFlags.js   # Feature flag system
│   ├── errorHandler.js   # Global error handling
│   ├── rateLimiter.js   # Rate limiting
│   ├── validationHandler.js # Input validation
│   └── paymentValidator.js # Payment validation
├── models/              # Mongoose schemas
│   ├── User.js          # User model with OAuth support
│   ├── Product.js       # Product model
│   └── Order.js        # Order model with payment fields
├── routes/              # API endpoints
│   ├── index.js         # Main router
│   ├── auth.js          # Authentication routes
│   ├── users.js         # User management routes
│   ├── products.js      # Product CRUD routes
│   ├── orders.js        # Order management routes
│   ├── admin.js         # Admin dashboard routes
│   └── payments.js      # Razorpay payment routes
├── utils/               # Utility functions
│   ├── asyncHandler.js   # Async error wrapper
│   └── helpers.js      # Common helper functions
├── scripts/             # Database and utility scripts
├── Dockerfile           # Docker container configuration
├── healthcheck.js       # Docker health check
├── server.js            # Application entry point
├── package.json         # Dependencies and scripts
└── .env.example        # Environment variables template
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up backend -d

# Or use the setup script
./scripts/docker-setup.ps1
```

### Option 2: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your actual configuration

# 3. Start development server
npm run dev
```

## 📝 Environment Variables

Create `.env` file from `.env.example`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/durga_art_zone

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Razorpay Payments
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret

# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Features
ENABLED_FEATURES=google-auth,email-notifications,payments
```

## 🎯 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /google` - Google OAuth initiation
- `GET /google/callback` - Google OAuth callback
- `POST /logout` - User logout

### Users (`/api/v1/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /orders` - Get user orders

### Products (`/api/v1/products`)
- `GET /` - Get all products (with pagination, filtering)
- `GET /:id` - Get single product
- `POST /` - Create product (admin only)
- `PUT /:id` - Update product (admin only)
- `DELETE /:id` - Delete product (admin only)

### Orders (`/api/v1/orders`)
- `POST /` - Create new order
- `GET /` - Get user orders
- `GET /:id` - Get single order
- `PUT /:id/cancel` - Cancel order
- `PUT /:id/status` - Update order status (admin/delivery)

### Payments (`/api/v1/payments`)
- `POST /create-order` - Create Razorpay order
- `POST /verify` - Verify Razorpay payment
- `POST /webhook` - Razorpay webhook handler

### Admin (`/api/v1/admin`)
- `GET /users` - Get all users
- `GET /orders` - Get all orders
- `GET /orders/stats` - Get order statistics
- `PUT /orders/:id/status` - Update order status

## 🔐 Authentication & Authorization

### JWT Authentication
- Secure token-based authentication
- Token expiration management
- Refresh token support
- Password hashing with bcrypt

### Google OAuth 2.0
- Complete Google account integration
- Automatic user creation/linking
- Profile picture import
- Email verification

### Role-Based Access Control (RBAC)
- **USER**: Browse, cart, checkout, view orders
- **ADMIN**: Full platform management
- **DELIVERY_PARTNER**: Order delivery management

## 💳 Payment Integration

### Razorpay Features
- **Order Creation**: Generate Razorpay orders
- **Payment Verification**: Secure signature verification
- **Webhook Handling**: Real-time payment updates
- **Multiple Methods**: Cards, UPI, Net Banking
- **Error Handling**: Comprehensive payment error management

### Payment Flow
1. Frontend creates Razorpay order
2. User completes payment via Razorpay modal
3. Backend verifies payment signature
4. Order status updated to 'paid'
5. User redirected to confirmation

## 🔒 Security Features

### Authentication Security
- JWT tokens with secure expiration
- Password hashing with bcrypt (10+ salt rounds)
- Rate limiting on auth endpoints
- Account lockout after failed attempts

### API Security
- Helmet.js security headers
- CORS configuration for frontend
- Input validation and sanitization
- SQL injection prevention (Mongoose)
- XSS protection

### Data Protection
- Environment variable encryption
- Secure cookie handling
- API key rotation support
- Audit logging

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin/delivery_partner),
  googleId: String (optional),
  profilePicture: String,
  addresses: [AddressSchema],
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  material: String,
  size: String,
  stock: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  orderNumber: String (unique),
  customer: ObjectId (ref: User),
  items: [OrderItemSchema],
  shippingAddress: AddressSchema,
  totalAmount: Number,
  paymentMethod: String (cod/razorpay),
  paymentStatus: String (pending/paid/failed),
  status: String (pending/confirmed/shipped/delivered),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paidAt: Date,
  createdAt: Date
}
```

## 🔄 Feature Flags

Features can be controlled via environment:
```env
ENABLED_FEATURES=google-auth,payments,email-notifications,analytics
```

Available flags:
- `google-auth`: Enable Google OAuth
- `payments`: Enable payment processing
- `email-notifications`: Enable email alerts
- `analytics`: Enable user analytics

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js
```

### Test Structure
- Unit tests for controllers and models
- Integration tests for API endpoints
- Authentication flow testing
- Payment flow testing
- Error handling testing

## 📈 Performance & Monitoring

### Performance Features
- Database indexing for fast queries
- Response compression
- Request logging and metrics
- Memory usage optimization
- Connection pooling

### Monitoring
- Health check endpoint (`/api/v1/health`)
- Error tracking and logging
- Performance metrics collection
- Database query monitoring

## 🐳 Docker Configuration

### Container Features
- Multi-stage build for optimization
- Non-root user for security
- Health checks with automatic restart
- Volume mounting for logs
- Environment variable injection

### Docker Commands
```bash
# Build image
docker build -t durga-art-backend .

# Run container
docker run -p 5000:5000 durga-art-backend

# View logs
docker-compose logs backend

# Access container
docker-compose exec backend sh
```

## 🚢 Deployment

### Production Setup
1. **Environment**: Set `NODE_ENV=production`
2. **Database**: Use MongoDB Atlas or production MongoDB
3. **SSL**: Configure HTTPS with reverse proxy
4. **Monitoring**: Set up health checks and logging
5. **Security**: Update all secrets and keys

### Deployment Options
- **Docker**: Recommended for consistency
- **Traditional**: Direct server deployment
- **Cloud Services**: AWS ECS, Google Cloud Run

## 🛠️ Development Guidelines

### Code Standards
- ESLint for code quality
- Prettier for formatting
- JSDoc for documentation
- TypeScript types where applicable

### Git Workflow
- Feature branches for new features
- Pull requests for code review
- Semantic versioning
- Comprehensive commit messages

### API Design
- RESTful principles
- Consistent response format
- Proper HTTP status codes
- Comprehensive error messages

## 🔧 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check MongoDB connection
mongosh "mongodb://localhost:27017/durga_art_zone"

# Verify environment variables
echo $MONGODB_URI
```

#### Authentication Issues
```bash
# Check JWT secret
echo $JWT_SECRET

# Verify Google OAuth settings
echo $GOOGLE_CLIENT_ID
```

#### Payment Issues
```bash
# Test Razorpay connection
curl -X POST http://localhost:5000/api/v1/payments/create-order

# Check webhook URL
echo $RAZORPAY_WEBHOOK_SECRET
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=app:* npm run dev

# View detailed logs
docker-compose logs backend --tail=100
```

## 📞 Support & Documentation

### Additional Documentation
- [Docker Setup Guide](../DOCKER_SETUP.md)
- [Razorpay Integration](../RAZORPAY_SETUP.md)
- [Google OAuth Setup](../GOOGLE_OAUTH_SETUP.md)

### Getting Help
1. Check environment variables
2. Review application logs
3. Verify database connection
4. Test API endpoints individually
5. Check Docker container status

---

**🔧 Production-ready backend with comprehensive e-commerce functionality**

**🔒 Enterprise-grade security and authentication**

**💳 Complete payment integration with Razorpay**

**🐳 Docker containerization for easy deployment**

---

## 📄 License

Private - All rights reserved
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


