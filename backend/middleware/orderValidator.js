const { body, validationResult } = require('express-validator');
const handleValidationErrors = require('./validationHandler');

/**
 * Order Validation Middleware
 * Validates order creation and update requests
 */

/**
 * Validate order creation
 */
exports.validateCreateOrder = [
    // Items validation
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),

    body('items.*.product')
        .isMongoId()
        .withMessage('Valid product ID is required'),

    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),

    body('items.*.size')
        .optional()
        .isString()
        .withMessage('Size must be a string'),

    // Shipping address validation
    body('shippingAddress.firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be between 1 and 50 characters'),

    body('shippingAddress.lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters'),

    body('shippingAddress.address')
        .trim()
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ min: 5, max: 200 })
        .withMessage('Address must be between 5 and 200 characters'),

    body('shippingAddress.city')
        .trim()
        .notEmpty()
        .withMessage('City is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('City must be between 2 and 50 characters'),

    body('shippingAddress.state')
        .trim()
        .notEmpty()
        .withMessage('State is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('State must be between 2 and 50 characters'),

    body('shippingAddress.postalCode')
        .trim()
        .notEmpty()
        .withMessage('Postal code is required')
        .isLength({ min: 5, max: 20 })
        .withMessage('Postal code must be between 5 and 20 characters'),

    body('shippingAddress.phone')
        .optional()
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters'),

    // Payment method validation
    body('paymentMethod')
        .isIn(['cod', 'card', 'upi', 'wallet'])
        .withMessage('Invalid payment method'),

    // Optional fields
    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters'),

    body('source')
        .optional()
        .isIn(['website', 'mobile', 'admin'])
        .withMessage('Invalid order source'),

    handleValidationErrors
];

/**
 * Validate order status update
 */
exports.validateUpdateStatus = [
    body('status')
        .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
        .withMessage('Invalid order status'),

    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters'),

    body('trackingNumber')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Tracking number must not exceed 50 characters'),

    body('deliveryPartner')
        .optional()
        .isMongoId()
        .withMessage('Valid delivery partner ID is required'),

    handleValidationErrors
];

/**
 * Validate order cancellation
 */
exports.validateCancelOrder = [
    body('reason')
        .optional()
        .isLength({ min: 5, max: 500 })
        .withMessage('Cancellation reason must be between 5 and 500 characters'),

    handleValidationErrors
];

/**
 * Validate order date range query
 */
exports.validateDateRange = [
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),

    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date'),

    handleValidationErrors
];
