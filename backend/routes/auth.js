const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');

// Import middleware
const protect = require('../middleware/auth');
const { checkFeatureFlag } = require('../middleware/featureFlags');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  validateRegister,
  validateLogin,
  validateUpdatePassword,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateDetails
} = require('../middleware/validator');

// Import Passport for Google OAuth (will be configured)
const passport = require('passport');

/**
 * Authentication Routes
 * 
 * POST   /api/v1/auth/register          - Register new user
 * POST   /api/v1/auth/login             - Login user
 * GET    /api/v1/auth/me                - Get current user
 * POST   /api/v1/auth/logout            - Logout user
 * PUT    /api/v1/auth/updatedetails     - Update user details
 * PUT    /api/v1/auth/updatepassword    - Update password
 * POST   /api/v1/auth/forgotpassword    - Request password reset
 * PUT    /api/v1/auth/resetpassword/:token - Reset password
 * GET    /api/v1/auth/google            - Initiate Google OAuth
 * GET    /api/v1/auth/google/callback   - Google OAuth callback
 */

// Public routes
router.post(
  '/register',
  authLimiter, // Stricter rate limiting for auth endpoints
  validateRegister,
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validateLogin,
  authController.login
);

router.post(
  '/forgotpassword',
  authLimiter,
  validateForgotPassword,
  authController.forgotPassword
);

router.put(
  '/resetpassword/:resettoken',
  authLimiter,
  validateResetPassword,
  authController.resetPassword
);

// Google OAuth routes (optional - only if Google OAuth is configured)
if (process.env.GOOGLE_CLIENT_ID) {
  router.get(
    '/google',
    checkFeatureFlag('google-auth'),
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  router.get(
    '/google/callback',
    checkFeatureFlag('google-auth'),
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    authController.googleCallback
  );
}

// Protected routes (require authentication)
router.get('/me', protect, authController.getMe);

router.post('/logout', protect, authController.logout);

router.put(
  '/updatedetails',
  protect,
  validateUpdateDetails,
  authController.updateDetails
);

router.put(
  '/updatepassword',
  protect,
  validateUpdatePassword,
  authController.updatePassword
);

module.exports = router;

