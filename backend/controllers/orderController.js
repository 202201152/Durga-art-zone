const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Order Controller
 * Handles all order-related operations
 */

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Private
 */
exports.createOrder = asyncHandler(async (req, res, next) => {
    const {
        items,
        shippingAddress,
        paymentMethod = 'cod',
        notes
    } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Order must contain at least one item'
        });
    }

    if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.lastName ||
        !shippingAddress.address || !shippingAddress.city || !shippingAddress.state ||
        !shippingAddress.postalCode) {
        return res.status(400).json({
            success: false,
            message: 'Complete shipping address is required'
        });
    }

    try {
        // Calculate order totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            // Validate product exists and is available
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });
            }

            if (product.status !== 'active') {
                return res.status(400).json({
                    success: false,
                    message: `Product ${product.name} is not available`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
                });
            }

            const itemPrice = product.price * item.quantity;
            subtotal += itemPrice;

            orderItems.push({
                product: item.product,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                size: item.size || 'One Size',
                image: product.images && product.images.length > 0 ? product.images[0] : ''
            });
        }

        // Calculate tax (10% tax rate)
        const tax = subtotal * 0.1;

        // Calculate shipping (flat rate for now)
        const shipping = subtotal > 1000 ? 0 : 50;

        // Calculate total
        const totalAmount = subtotal + tax + shipping;

        // Create order
        const order = await Order.create({
            customer: req.user.id,
            items: orderItems,
            subtotal,
            tax,
            shipping,
            discount: 0,
            totalAmount,
            shippingAddress,
            paymentMethod,
            notes,
            source: req.body.source || 'website',
            userAgent: req.get('User-Agent'),
            ipAddress: req.ip
        });

        // Update product stock
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Populate order details for response
        await order.populate([
            { path: 'customer', select: 'name email phone' },
            { path: 'items.product', select: 'name images' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

/**
 * @desc    Get user orders
 * @route   GET /api/v1/orders
 * @access  Private
 */
exports.getUserOrders = asyncHandler(async (req, res, next) => {
    const {
        page = 1,
        limit = 10,
        status,
        startDate,
        endDate
    } = req.query;

    // Build query
    const query = { customer: req.user.id };

    if (status) {
        query.status = status;
    }

    if (startDate || endDate) {
        query.orderDate = {};
        if (startDate) {
            query.orderDate.$gte = new Date(startDate);
        }
        if (endDate) {
            query.orderDate.$lte = new Date(endDate);
        }
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
        .populate([
            { path: 'items.product', select: 'name images price' }
        ])
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limitNum);

    const total = await Order.countDocuments(query);

    res.status(200).json({
        success: true,
        count: orders.length,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum)
        },
        data: orders
    });
});

/**
 * @desc    Get single order by ID
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
exports.getOrderById = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate([
            { path: 'customer', select: 'name email phone' },
            { path: 'items.product', select: 'name images price description' }
        ]);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    // Check if user owns this order or is admin
    if (order.customer._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

/**
 * @desc    Update order status
 * @route   PUT /api/v1/orders/:id/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { status, notes, trackingNumber, deliveryPartner } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: 'Status is required'
        });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    // Validate status transition
    const validTransitions = {
        'pending': ['confirmed', 'cancelled'],
        'confirmed': ['processing', 'cancelled'],
        'processing': ['shipped', 'cancelled'],
        'shipped': ['delivered'],
        'delivered': [], // Final status
        'cancelled': [], // Final status
        'refunded': [] // Final status
    };

    if (!validTransitions[order.status]?.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Cannot change order status from ${order.status} to ${status}`
        });
    }

    // Update order
    const updateData = { status };

    if (notes) updateData.notes = notes;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (deliveryPartner) updateData.deliveryPartner = deliveryPartner;

    // Set date based on status
    const now = new Date();
    switch (status) {
        case 'confirmed':
            updateData.confirmedDate = now;
            break;
        case 'shipped':
            updateData.shippedDate = now;
            updateData.estimatedDelivery = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
            break;
        case 'delivered':
            updateData.deliveredDate = now;
            break;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder
    });
});

/**
 * @desc    Cancel order
 * @route   PUT /api/v1/orders/:id/cancel
 * @access  Private
 */
exports.cancelOrder = asyncHandler(async (req, res, next) => {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    // Check if user owns this order
    if (order.customer._id.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
        return res.status(400).json({
            success: false,
            message: 'Order cannot be cancelled at this stage'
        });
    }

    // Update order status and add cancellation reason
    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: 'cancelled',
            notes: reason ? `${order.notes}\n\nCancellation Reason: ${reason}` : order.notes,
            customerNotes: reason
        },
        { new: true, runValidators: true }
    );

    // Restore product stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: item.quantity } }
        );
    }

    res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: updatedOrder
    });
});

/**
 * @desc    Get all orders (admin only)
 * @route   GET /api/v1/admin/orders
 * @access  Private/Admin
 */
exports.getAllOrders = asyncHandler(async (req, res, next) => {
    const {
        page = 1,
        limit = 20,
        status,
        startDate,
        endDate,
        customer: customerId
    } = req.query;

    // Build query
    const query = {};

    if (status) query.status = status;
    if (customerId) query.customer = customerId;

    if (startDate || endDate) {
        query.orderDate = {};
        if (startDate) query.orderDate.$gte = new Date(startDate);
        if (endDate) query.orderDate.$lte = new Date(endDate);
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
        .populate([
            { path: 'customer', select: 'name email phone' },
            { path: 'items.product', select: 'name images price' }
        ])
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limitNum);

    const total = await Order.countDocuments(query);

    res.status(200).json({
        success: true,
        count: orders.length,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum)
        },
        data: orders
    });
});

/**
 * @desc    Get order statistics
 * @route   GET /api/v1/admin/orders/stats
 * @access  Private/Admin
 */
exports.getOrderStats = asyncHandler(async (req, res, next) => {
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

    // Get order statistics
    const stats = await Order.aggregate([
        {
            $match: {
                orderDate: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalAmount' },
                averageOrderValue: { $avg: '$totalAmount' }
            }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const totalStats = stats.find(stat => stat._id === null);
    const statusBreakdown = stats.filter(stat => stat._id !== null);

    res.status(200).json({
        success: true,
        data: {
            period,
            totalOrders: totalStats?.totalOrders || 0,
            totalRevenue: totalStats?.totalRevenue || 0,
            averageOrderValue: totalStats?.averageOrderValue || 0,
            statusBreakdown
        }
    });
});
