const express = require('express');
const config = require('../config');
const router = express.Router();

/**
 * Main API router
 * Handles versioning and routes to specific modules
 * 
 * API Structure:
 * /api/v1/auth - Authentication routes
 * /api/v1/products - Product routes
 * /api/v1/users - User routes
 * /api/v1/orders - Order routes
 * /api/v1/admin - Admin routes
 * /api/v1/delivery - Delivery partner routes
 * /api/v1/payments - Payment routes
 */

// Import route modules
const authRoutes = require('./auth');
const productRoutes = require('./products');
const adminRoutes = require('./admin');
const orderRoutes = require('./orders');
const paymentRoutes = require('./payments');
// const userRoutes = require('./users');
// const deliveryRoutes = require('./delivery');

// Versioned API routes
const v1Router = express.Router();

// Mount route modules
v1Router.use('/auth', authRoutes);
v1Router.use('/products', productRoutes);
v1Router.use('/admin', adminRoutes);
v1Router.use('/orders', orderRoutes);
v1Router.use('/payments', paymentRoutes);
// v1Router.use('/users', userRoutes);
// v1Router.use('/delivery', deliveryRoutes);

// Placeholder route
v1Router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Durga Art Zone API',
    version: config.apiVersion,
    endpoints: {
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      orders: '/api/v1/orders',
      admin: '/api/v1/admin',
      delivery: '/api/v1/delivery',
      payments: '/api/v1/payments'
    }
  });
});

// Mount versioned router
router.use(`/${config.apiVersion}`, v1Router);

module.exports = router;

