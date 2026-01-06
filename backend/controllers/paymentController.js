const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config');

/**
 * Payment Controller
 * Handles Razorpay payment integration
 */

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret
});

/**
 * @desc    Create Razorpay order
 * @route   POST /api/v1/payments/create-order
 * @access  Private
 */
exports.createRazorpayOrder = asyncHandler(async (req, res, next) => {
    const { amount, currency = 'INR', receipt } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Valid amount is required'
        });
    }

    try {
        // Create Razorpay order
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt,
            payment_capture: 1, // Auto capture payment
            notes: {
                userId: req.user.id
            }
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            data: {
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                receipt: razorpayOrder.receipt
            }
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order'
        });
    }
});

/**
 * @desc    Verify Razorpay payment
 * @route   POST /api/v1/payments/verify
 * @access  Private
 */
exports.verifyPayment = asyncHandler(async (req, res, next) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: 'Payment verification details are required'
        });
    }

    try {
        // Generate signature
        const generated_signature = crypto
            .createHmac('sha256', config.razorpay.keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        // Verify signature
        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Fetch payment details from Razorpay
        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        // Check payment status
        if (payment.status !== 'captured') {
            return res.status(400).json({
                success: false,
                message: `Payment not successful. Status: ${payment.status}`
            });
        }

        // Update order status in database
        const order = await Order.findOne({
            razorpayOrderId: razorpay_order_id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order with payment details
        order.paymentStatus = 'paid';
        order.paymentMethod = 'razorpay';
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpayOrderId = razorpay_order_id;
        order.paidAt = new Date();
        order.status = 'confirmed';

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                orderId: order._id,
                paymentId: razorpay_payment_id,
                status: payment.status
            }
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed'
        });
    }
});

/**
 * @desc    Handle Razorpay webhook
 * @route   POST /api/v1/payments/webhook
 * @access  Public
 */
exports.handleWebhook = asyncHandler(async (req, res, next) => {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        return res.status(400).json({
            success: false,
            message: 'Webhook signature missing'
        });
    }

    try {
        // Verify webhook signature
        const body = JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid webhook signature'
            });
        }

        const event = req.body.event;
        const payload = req.body.payload;

        console.log('Razorpay webhook event:', event);

        switch (event) {
            case 'payment.captured':
                await handlePaymentCaptured(payload.payment.entity);
                break;

            case 'payment.failed':
                await handlePaymentFailed(payload.payment.entity);
                break;

            case 'order.paid':
                await handleOrderPaid(payload.order.entity);
                break;

            default:
                console.log('Unhandled webhook event:', event);
        }

        res.status(200).json({
            success: true,
            message: 'Webhook processed successfully'
        });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Webhook processing failed'
        });
    }
});

/**
 * Helper function to handle successful payment
 */
async function handlePaymentCaptured(payment) {
    try {
        const order = await Order.findOne({
            razorpayOrderId: payment.order_id
        });

        if (order && order.paymentStatus !== 'paid') {
            order.paymentStatus = 'paid';
            order.paymentMethod = 'razorpay';
            order.razorpayPaymentId = payment.id;
            order.paidAt = new Date();
            order.status = 'confirmed';
            await order.save();

            console.log(`Payment captured for order ${order._id}`);
        }
    } catch (error) {
        console.error('Error handling payment captured:', error);
    }
}

/**
 * Helper function to handle failed payment
 */
async function handlePaymentFailed(payment) {
    try {
        const order = await Order.findOne({
            razorpayOrderId: payment.order_id
        });

        if (order && order.paymentStatus !== 'failed') {
            order.paymentStatus = 'failed';
            order.paymentMethod = 'razorpay';
            order.razorpayPaymentId = payment.id;
            order.status = 'payment_failed';
            await order.save();

            console.log(`Payment failed for order ${order._id}`);
        }
    } catch (error) {
        console.error('Error handling payment failed:', error);
    }
}

/**
 * Helper function to handle order paid
 */
async function handleOrderPaid(order) {
    try {
        const existingOrder = await Order.findOne({
            razorpayOrderId: order.id
        });

        if (existingOrder && existingOrder.paymentStatus !== 'paid') {
            existingOrder.paymentStatus = 'paid';
            existingOrder.status = 'confirmed';
            await existingOrder.save();

            console.log(`Order paid: ${existingOrder._id}`);
        }
    } catch (error) {
        console.error('Error handling order paid:', error);
    }
}
