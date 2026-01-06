const mongoose = require('mongoose');

/**
 * Order Schema
 * Represents customer orders in the e-commerce system
 */

const orderSchema = new mongoose.Schema({
    // Order Information
    orderNumber: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            return 'ORD' + Date.now().toString(36).toUpperCase().slice(-8);
        }
    },

    // Customer Information
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Order Items
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        size: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: true
        }
    }],

    // Pricing
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    shipping: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    // Shipping Information
    shippingAddress: {
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        company: {
            type: String,
            trim: true,
            maxlength: 100
        },
        address: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        apartment: {
            type: String,
            trim: true,
            maxlength: 50
        },
        city: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        state: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        postalCode: {
            type: String,
            required: true,
            trim: true,
            maxlength: 20
        },
        country: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
            default: 'India'
        },
        phone: {
            type: String,
            trim: true,
            maxlength: 20
        }
    },

    // Order Status
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
    },

    // Payment Information
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'completed', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'card', 'upi', 'wallet', 'razorpay'],
        default: 'cod'
    },
    paymentId: {
        type: String,
        required: false
    },

    // Razorpay specific fields
    razorpayOrderId: {
        type: String,
        required: false,
        sparse: true
    },
    razorpayPaymentId: {
        type: String,
        required: false,
        sparse: true
    },
    paidAt: {
        type: Date,
        required: false
    },

    // Delivery Information
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    estimatedDelivery: {
        type: Date,
        required: false
    },
    actualDelivery: {
        type: Date,
        required: false
    },
    trackingNumber: {
        type: String,
        required: false,
        trim: true
    },

    // Timestamps
    orderDate: {
        type: Date,
        default: Date.now
    },
    confirmedDate: {
        type: Date,
        required: false
    },
    shippedDate: {
        type: Date,
        required: false
    },
    deliveredDate: {
        type: Date,
        required: false
    },

    // Notes
    notes: {
        type: String,
        trim: true,
        maxlength: 500
    },
    customerNotes: {
        type: String,
        trim: true,
        maxlength: 500
    },

    // Metadata
    source: {
        type: String,
        enum: ['website', 'mobile', 'admin'],
        default: 'website'
    },
    userAgent: {
        type: String,
        required: false
    },
    ipAddress: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
orderSchema.index({ customer: 1, orderDate: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

// Virtuals
orderSchema.virtual('isDelivered').get(function () {
    return this.status === 'delivered';
});

orderSchema.virtual('isCancelled').get(function () {
    return this.status === 'cancelled';
});

orderSchema.virtual('isRefunded').get(function () {
    return this.status === 'refunded';
});

orderSchema.virtual('canCancel').get(function () {
    return ['pending', 'confirmed'].includes(this.status);
});

orderSchema.virtual('canTrack').get(function () {
    return ['confirmed', 'processing', 'shipped'].includes(this.status);
});

// Pre-save middleware
orderSchema.pre('save', function (next) {
    // Calculate total amount if not provided
    if (!this.totalAmount) {
        this.totalAmount = this.subtotal + this.tax + this.shipping - this.discount;
    }

    // Set order number if not provided
    if (!this.orderNumber) {
        this.orderNumber = 'ORD' + Date.now().toString(36).toUpperCase().slice(-8);
    }

    next();
});

module.exports = mongoose.model('Order', orderSchema);
