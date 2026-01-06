# 🌐 Durga Art Zone - Frontend

Production-grade Next.js 14 frontend for jewelry e-commerce platform with complete shopping experience.

## 🏗️ Tech Stack

- **Framework**: Next.js 14 with App Router and TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query (React Query) for server state
- **Authentication**: JWT + Google OAuth 2.0 integration
- **Payments**: Razorpay with secure checkout flow
- **UI Components**: Custom components with accessibility
- **Image Optimization**: Next.js Image with fallbacks
- **Deployment**: Production-ready with Docker support

## 📁 Project Structure

```
frontend/
├── app/                     # Next.js App Router pages
│   ├── (auth)/              # Authentication routes
│   │   ├── login/           # Login page with Google OAuth
│   │   ├── callback/         # OAuth callback handler
│   │   └── layout.tsx       # Auth layout
│   ├── (shop)/              # Shop routes
│   │   ├── page.tsx         # Products listing
│   │   └── layout.tsx       # Shop layout
│   ├── cart/                 # Shopping cart
│   │   └── page.tsx         # Cart management
│   ├── checkout/              # Checkout flow
│   │   └── page.tsx         # Complete checkout with payments
│   ├── admin/                # Admin dashboard
│   │   └── page.tsx         # Admin interface
│   ├── payment/              # Payment result pages
│   │   ├── success/         # Payment success
│   │   └── failed/          # Payment failure
│   ├── globals.css            # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/              # Reusable React components
│   ├── auth/               # Authentication components
│   │   ├── GoogleButton.tsx # Google OAuth button
│   │   └── Logo.tsx       # Brand logo
│   ├── products/           # Product-related components
│   │   ├── ProductCard.tsx # Product display card
│   │   └── ProductGrid.tsx # Products grid
│   ├── ui/                 # General UI components
│   │   ├── Button.tsx       # Custom button
│   │   ├── Input.tsx        # Form inputs
│   │   └── Modal.tsx        # Modal dialogs
│   └── providers/           # React context providers
│       ├── Providers.tsx     # App providers wrapper
│       └── ToastProvider.tsx # Notification system
├── contexts/               # React contexts for state
│   ├── AuthContext.tsx     # Authentication state
│   └── CartContext.tsx     # Shopping cart state
├── lib/                    # Utilities and configurations
│   ├── api/               # API client setup
│   │   └── client.ts      # Axios configuration
│   ├── features/           # Feature flag system
│   └── utils/             # Helper functions
├── types/                  # TypeScript definitions
│   └── razorpay.d.ts      # Razorpay types
├── public/                 # Static assets
│   ├── images/            # Image assets
│   └── favicon.ico        # Site favicon
├── Dockerfile              # Docker container config
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
└── .env.example           # Environment variables template
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up frontend -d

# Or use the setup script
./scripts/docker-setup.ps1
```

### Option 2: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your actual configuration

# 3. Start development server
npm run dev
```

## 📝 Environment Variables

Create `.env.local` file from `.env.example`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Razorpay Payments
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
```

## 🎯 Key Features

### 🛍️ Shopping Experience

#### **Product Catalog**
- Responsive product grid with filtering
- Advanced search functionality
- Product detail pages with image galleries
- Category-based navigation
- Price and material filters

#### **Shopping Cart**
- Add to cart with quantity management
- Cart persistence across sessions
- Size and material selection
- Real-time cart updates
- Item removal and quantity adjustment

#### **Checkout Process**
- Multi-step checkout flow
- Address management and validation
- Multiple payment methods (COD, Razorpay)
- Order summary and confirmation
- Form validation with error handling

### 🔐 Authentication System

#### **User Authentication**
- Email/password login with JWT
- Google OAuth 2.0 integration
- Secure token storage
- Automatic logout on token expiration
- Profile management

#### **Authorization**
- Protected routes with middleware
- Role-based access control
- Admin-only routes protection
- Delivery partner access control

### 💳 Payment Integration

#### **Razorpay Integration**
- Secure payment modal integration
- Multiple payment methods (Cards, UPI, Net Banking)
- Payment verification and confirmation
- Error handling and retry logic
- Success/failure page redirects

#### **Payment Flow**
1. User selects Razorpay at checkout
2. Frontend creates payment order
3. Razorpay modal opens for payment
4. Payment completion triggers verification
5. Order confirmation on success
6. Error handling on failure

### 🎨 User Interface

#### **Design System**
- Custom color palette for jewelry brand
- Responsive design for all devices
- Accessibility compliance (WCAG 2.1)
- Loading states and skeletons
- Error boundaries and handling

#### **Components**
- Reusable product cards
- Interactive shopping cart
- Form inputs with validation
- Modal dialogs and notifications
- Navigation and header components

### 📱 Mobile Experience

#### **Responsive Design**
- Mobile-first design approach
- Touch-friendly interactions
- Optimized images for mobile
- Swipe gestures for product galleries
- Mobile-optimized checkout flow

## 🔧 Development Features

### State Management
```typescript
// Cart Context
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  material?: string;
  image: string;
}

interface CartContext {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
```

### API Integration
```typescript
// API Client Configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request/Response Interceptors for auth and error handling
```

### Feature Flags
```typescript
// Feature Flag System
const features = {
  GOOGLE_AUTH: process.env.NEXT_PUBLIC_GOOGLE_AUTH === 'true',
  RAZORPAY: process.env.NEXT_PUBLIC_RAZORPAY === 'true',
  ADMIN_DASHBOARD: process.env.NEXT_PUBLIC_ADMIN === 'true',
};
```

## 🎨 Styling & Theming

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#d4a574',
          secondary: '#c49560',
        },
        jewelry: {
          gold: '#d4af37',
          silver: '#c0c0c0',
          rose: '#e8b4b8',
        }
      }
    }
  }
}
```

### Custom Components
- Consistent design language
- Accessibility-first approach
- Dark mode support (ready)
- Internationalization ready

## 📊 Performance Optimizations

### Image Optimization
- Next.js Image component with lazy loading
- WebP and AVIF format support
- Responsive image generation
- Fallback handling for failed loads

### Code Splitting
- Automatic route-based splitting
- Dynamic imports for heavy components
- Preloading for critical routes
- Bundle size optimization

### Caching Strategy
- API response caching with React Query
- Image caching with Next.js
- Static asset optimization
- Service worker ready

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Structure
- Component unit tests
- Integration tests for pages
- API mocking and testing
- User flow testing
- Accessibility testing

## 🐳 Docker Configuration

### Container Features
- Multi-stage build for optimization
- Standalone output for production
- Health checks and monitoring
- Environment variable injection
- Non-root user for security

### Docker Commands
```bash
# Build image
docker build -t durga-art-frontend .

# Run container
docker run -p 3000:3000 durga-art-frontend

# View logs
docker-compose logs frontend

# Access container
docker-compose exec frontend sh
```

## 🚢 Deployment

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Setup
- **Development**: `npm run dev`
- **Production**: `npm run build && npm start`
- **Docker**: `docker-compose up`

### Deployment Platforms
- **Vercel**: Recommended for Next.js
- **Netlify**: Static site deployment
- **AWS S3 + CloudFront**: Custom CDN setup
- **Docker**: Container orchestration

## 🔒 Security Features

### Frontend Security
- XSS protection with React's built-in safeguards
- CSRF protection with same-site cookies
- Content Security Policy headers
- Secure cookie handling
- Environment variable protection

### API Security
- Request/response interceptors
- Token refresh mechanism
- Rate limiting awareness
- Error boundary implementation

## 📈 Analytics & Monitoring

### Performance Monitoring
- Web Vitals tracking
- Error boundary logging
- User interaction tracking
- Performance metrics collection

### Business Analytics
- Purchase funnel tracking
- User behavior analysis
- Conversion rate monitoring
- Product performance analytics

## 🛠️ Development Guidelines

### Code Standards
- TypeScript strict mode
- ESLint for code quality
- Prettier for formatting
- Husky for pre-commit hooks

### Component Guidelines
- Functional components with hooks
- Props interface definitions
- Accessibility attributes
- Responsive design principles

### Git Workflow
- Feature branches for development
- Pull request reviews
- Semantic versioning
- Automated testing on PRs

## 🔧 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules && npm install

# Check TypeScript errors
npm run type-check
```

#### Development Issues
```bash
# Check environment variables
echo $NEXT_PUBLIC_API_URL

# Verify API connection
curl http://localhost:5000/api/v1/health
```

#### Styling Issues
```bash
# Check Tailwind build
npm run build:css

# Verify Tailwind config
npx tailwindcss --help
```

### Debug Mode
```bash
# Enable Next.js debug
NEXT_DEBUG=1 npm run dev

# View build analyzer
npm run analyze
```

## 📞 Support & Documentation

### Additional Documentation
- [Docker Setup Guide](../DOCKER_SETUP.md)
- [Razorpay Integration](../RAZORPAY_SETUP.md)
- [Google OAuth Setup](../GOOGLE_OAUTH_SETUP.md)
- [Backend API Docs](../backend/README.md)

### Getting Help
1. Check environment variables
2. Verify API connectivity
3. Review browser console errors
4. Check network requests
5. Review component props

---

**🌐 Production-ready frontend with complete e-commerce experience**

**🎨 Beautiful UI with responsive design and accessibility**

**💳 Secure payment integration with Razorpay**

**🐳 Docker containerization for easy deployment**

---

## 📄 License

Private - All rights reserved

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

See `.env.example` for required variables.

All environment variables prefixed with `NEXT_PUBLIC_` are available on the client side.

## Deployment

This project is configured for Vercel deployment. Simply push to your repository and connect it to Vercel.

## Feature Flags

Frontend respects feature flags from the backend. Use the `isFeatureEnabled` utility to conditionally render features.

## Notes

- Components will be added module by module as features are built
- All UI components will follow provided Figma designs
- API integration follows RESTful patterns
- Error handling is centralized in the API client


