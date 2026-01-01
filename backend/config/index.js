/**
 * Centralized configuration module
 * All environment variables are accessed through this module
 * This makes it easier to validate, type-check, and modify configuration
 */

require('dotenv').config();

const config = {
  // Server Configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  apiVersion: process.env.API_VERSION || 'v1',

  // Database
  mongodbUri: process.env.MONGODB_URI,
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d'
  },

  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL
  },

  // Razorpay
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET
  },

  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // AWS (for future deployment)
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },

  // Feature Flags
  enabledFeatures: process.env.ENABLED_FEATURES 
    ? process.env.ENABLED_FEATURES.split(',').map(f => f.trim())
    : []
};

// Validation for production
if (config.nodeEnv === 'production') {
  const required = [
    'mongodbUri',
    'jwt.secret',
    'razorpay.keyId',
    'razorpay.keySecret'
  ];

  required.forEach(key => {
    const keys = key.split('.');
    let value = config;
    for (const k of keys) {
      value = value[k];
    }
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
}

module.exports = config;


