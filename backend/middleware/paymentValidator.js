const { body, validationResult } = require('express-validator');

/**
 * Payment Validation Middleware
 * Validates Razorpay payment requests
 */

/**
 * Validate Razorpay order creation
 */
const validateRazorpayOrder = (req, res, next) => {
    const validations = [
        body('amount')
            .isNumeric()
            .withMessage('Amount must be a number')
            .isFloat({ gt: 0 })
            .withMessage('Amount must be greater than 0'),

        body('currency')
            .optional()
            .isIn(['INR', 'USD'])
            .withMessage('Currency must be INR or USD'),

        body('receipt')
            .optional()
            .isLength({ max: 40 })
            .withMessage('Receipt must be less than 40 characters')
    ];

    // Run validations
    Promise.all(validations.map(validation => validation.run(req)))
        .then(() => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }
            next();
        })
        .catch(next);
};

/**
 * Validate payment verification
 */
const validatePaymentVerification = (req, res, next) => {
    const validations = [
        body('razorpay_order_id')
            .notEmpty()
            .withMessage('Razorpay order ID is required')
            .isLength({ min: 14, max: 14 })
            .withMessage('Invalid Razorpay order ID format'),

        body('razorpay_payment_id')
            .notEmpty()
            .withMessage('Razorpay payment ID is required')
            .isLength({ min: 14, max: 14 })
            .withMessage('Invalid Razorpay payment ID format'),

        body('razorpay_signature')
            .notEmpty()
            .withMessage('Razorpay signature is required')
            .isLength({ min: 64, max: 64 })
            .withMessage('Invalid Razorpay signature format')
    ];

    // Run validations
    Promise.all(validations.map(validation => validation.run(req)))
        .then(() => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }
            next();
        })
        .catch(next);
};

module.exports = {
    validateRazorpayOrder,
    validatePaymentVerification
};
