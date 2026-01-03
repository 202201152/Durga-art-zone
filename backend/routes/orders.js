const express = require('express');
const router = express.Router();

// Import controllers
const orderController = require('../controllers/orderController');

// Import middleware
const protect = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const {
    validateCreateOrder,
    validateUpdateStatus,
    validateCancelOrder,
    validateDateRange
} = require('../middleware/orderValidator');

/**
 * Order Routes
 * 
 * POST   /api/v1/orders              - Create new order
 * GET    /api/v1/orders              - Get user orders
 * GET    /api/v1/orders/:id           - Get single order
 * PUT    /api/v1/orders/:id/status    - Update order status (admin)
 * PUT    /api/v1/orders/:id/cancel    - Cancel order
 * GET    /api/v1/admin/orders        - Get all orders (admin)
 * GET    /api/v1/admin/orders/stats  - Get order statistics (admin)
 */

// Public routes (none - all order routes require authentication)

// Protected routes (require authentication)
router.post(
    '/',
    protect,
    validateCreateOrder,
    orderController.createOrder
);

router.get(
    '/',
    protect,
    orderController.getUserOrders
);

router.get(
    '/:id',
    protect,
    orderController.getOrderById
);

router.put(
    '/:id/cancel',
    protect,
    validateCancelOrder,
    orderController.cancelOrder
);

// Admin routes (require admin role)
router.put(
    '/:id/status',
    protect,
    authorize('admin'),
    validateUpdateStatus,
    orderController.updateOrderStatus
);

router.get(
    '/admin/orders',
    protect,
    authorize('admin'),
    validateDateRange,
    orderController.getAllOrders
);

router.get(
    '/admin/orders/stats',
    protect,
    authorize('admin'),
    validateDateRange,
    orderController.getOrderStats
);

module.exports = router;
