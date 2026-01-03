const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Admin Controller
 * Handles all admin-specific operations
 */

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/v1/admin/dashboard
 * @access  Private/Admin
 */
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
    // Get basic counts
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue (sum of all delivered orders)
    const revenueResult = await Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get recent orders
    const recentOrders = await Order.find()
        .sort({ orderDate: -1 })
        .limit(5)
        .populate([
            { path: 'customer', select: 'name' },
            { path: 'items', select: 'name price quantity' }
        ]);

    // Get top products (by order frequency)
    const topProducts = await Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.product', count: { $sum: 1 }, totalSold: { $sum: '$items.quantity' } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product'
            }
        },
        {
            $project: {
                name: '$product.name',
                sales: '$count',
                revenue: { $multiply: ['$totalSold', '$product.price'] }
            }
        }
    ]);

    // Get low stock products
    const lowStockProducts = await Product.find({
        status: 'active',
        stock: { $lte: 10 }
    })
        .sort({ stock: 1 })
        .limit(10)
        .select('name category stock');

    res.status(200).json({
        success: true,
        data: {
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue,
            recentOrders,
            topProducts,
            lowStockProducts,
        }
    });
});

/**
 * @desc    Get admin statistics summary
 * @route   GET /api/v1/admin/stats
 * @access  Private/Admin
 */
exports.getAdminStats = asyncHandler(async (req, res, next) => {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = 0; // Will implement when Order model is ready
    const totalRevenue = 0; // Will calculate from orders later

    res.status(200).json({
        success: true,
        data: {
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue,
        }
    });
});

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/v1/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const {
        page = 1,
        limit = 20,
        search,
        role,
        status
    } = req.query;

    // Build query
    const query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    if (role) {
        query.role = role;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    const total = await User.countDocuments(query);

    res.status(200).json({
        success: true,
        count: users.length,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum)
        },
        data: users
    });
});

/**
 * @desc    Update user role (admin only)
 * @route   PUT /api/v1/admin/users/:id/role
 * @access  Private/Admin
 */
exports.updateUserRole = asyncHandler(async (req, res, next) => {
    const { role } = req.body;

    if (!['user', 'admin', 'delivery_partner'].includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role'
        });
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        data: user
    });
});

/**
 * @desc    Toggle user status (active/banned)
 * @route   PUT /api/v1/admin/users/:id/status
 * @access  Private/Admin
 */
exports.toggleUserStatus = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.id) {
        return res.status(400).json({
            success: false,
            message: 'You cannot change your own status'
        });
    }

    user.isActive = user.isActive === undefined ? false : !user.isActive;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
        data: user
    });
});

/**
 * @desc    Get system analytics
 * @route   GET /api/v1/admin/analytics
 * @access  Private/Admin
 */
exports.getAnalytics = asyncHandler(async (req, res, next) => {
    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (period) {
        case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case '90d':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        default:
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Product analytics
    const productsByCategory = await Product.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    const productsByMaterial = await Product.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$material', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    const lowStockCount = await Product.countDocuments({
        status: 'active',
        stock: { $lte: 10 }
    });

    const outOfStockCount = await Product.countDocuments({
        status: 'active',
        stock: { $eq: 0 }
    });

    // User analytics
    const newUsers = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: startDate }
    });

    const totalActiveUsers = await User.countDocuments({
        role: 'user',
        isActive: { $ne: false }
    });

    // Placeholder for order analytics (will implement when Order model is ready)
    const orderAnalytics = {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        ordersByStatus: {}
    };

    res.status(200).json({
        success: true,
        data: {
            products: {
                byCategory: productsByCategory,
                byMaterial: productsByMaterial,
                lowStockCount,
                outOfStockCount,
                totalActive: await Product.countDocuments({ status: 'active' })
            },
            users: {
                newUsers,
                totalActive: totalActiveUsers,
                total: await User.countDocuments({ role: 'user' })
            },
            orders: orderAnalytics,
            period
        }
    });
});

/**
 * @desc    Get system health
 * @route   GET /api/v1/admin/health
 * @access  Private/Admin
 */
exports.getSystemHealth = asyncHandler(async (req, res, next) => {
    // Database connection check
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Get collection stats
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();

    // Memory usage
    const memUsage = process.memoryUsage();

    res.status(200).json({
        success: true,
        data: {
            database: {
                status: dbStatus,
                collections: {
                    products: productCount,
                    users: userCount
                }
            },
            server: {
                uptime: process.uptime(),
                memory: {
                    used: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
                    total: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB'
                },
                nodeVersion: process.version,
                platform: process.platform
            },
            timestamp: new Date().toISOString()
        }
    });
});
