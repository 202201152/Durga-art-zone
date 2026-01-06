const express = require('express');
const router = express.Router();

// Import controllers
const paymentController = require('../controllers/paymentController');

// Import middleware
const protect = require('../middleware/auth');
const {
    validateRazorpayOrder,
    validatePaymentVerification
} = require('../middleware/paymentValidator');

/**
 * Payment Routes
 * 
 * POST   /api/v1/payments/create-order  - Create Razorpay order
 * POST   /api/v1/payments/verify       - Verify payment
 * POST   /api/v1/payments/webhook      - Razorpay webhook
 */

// Protected routes (require authentication)
router.post(
    '/create-order',
    protect,
    validateRazorpayOrder,
    paymentController.createRazorpayOrder
);

router.post(
    '/verify',
    protect,
    validatePaymentVerification,
    paymentController.verifyPayment
);

// Public webhook route (no authentication required)
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }), // Important for webhook signature verification
    paymentController.handleWebhook
);

module.exports = router;
