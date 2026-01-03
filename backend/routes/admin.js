const express = require('express');
const router = express.Router();

// Import controllers
const adminController = require('../controllers/adminController');

// Import middleware
const protect = require('../middleware/auth');
const authorize = require('../middleware/rbac');

/**
 * Admin Routes
 * 
 * All routes require authentication and admin role
 */

// Dashboard & Stats
router.get(
    '/dashboard',
    protect,
    authorize('admin'),
    adminController.getDashboardStats
);

router.get(
    '/stats',
    protect,
    authorize('admin'),
    adminController.getAdminStats
);

// User Management
router.get(
    '/users',
    protect,
    authorize('admin'),
    adminController.getAllUsers
);

router.put(
    '/users/:id/role',
    protect,
    authorize('admin'),
    adminController.updateUserRole
);

router.put(
    '/users/:id/status',
    protect,
    authorize('admin'),
    adminController.toggleUserStatus
);

// Analytics
router.get(
    '/analytics',
    protect,
    authorize('admin'),
    adminController.getAnalytics
);

// System Health
router.get(
    '/health',
    protect,
    authorize('admin'),
    adminController.getSystemHealth
);

module.exports = router;
