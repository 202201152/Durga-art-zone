const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const session = require('express-session');
require('dotenv').config();

const config = require('./config');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Initialize Passport for Google OAuth (if configured)
const passport = require('./config/passport');

// Import routes
const apiRoutes = require('./routes');

const app = express();

// Trust proxy (important for Vercel/AWS deployment)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Compression middleware
app.use(compression());

// Session middleware (required for Passport OAuth)
app.use(
  session({
    secret: config.jwt.secret || 'temp-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: config.nodeEnv === 'production' }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use('/api/', rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = config.port || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/${config.apiVersion}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });

    // Handle server errors gracefully
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error(`   Please either:`);
        console.error(`   1. Stop the process using port ${PORT}`);
        console.error(`   2. Change PORT in .env file to a different port`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();

module.exports = app;

