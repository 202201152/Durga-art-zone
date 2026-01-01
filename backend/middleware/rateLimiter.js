const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware
 * Prevents abuse by limiting the number of requests per IP
 * 
 * Different limits for different endpoints:
 * - General API: 100 requests per 15 minutes
 * - Auth endpoints: 5 requests per 15 minutes (stricter)
 * - Payment endpoints: 10 requests per 15 minutes
 */

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Payment endpoint limiter
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many payment requests, please try again later.'
  },
});

module.exports = generalLimiter;
module.exports.authLimiter = authLimiter;
module.exports.paymentLimiter = paymentLimiter;


