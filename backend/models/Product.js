const mongoose = require('mongoose');

/**
 * Product Schema
 * Production-grade product model with lifecycle control
 */

const productSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    material: {
      type: String,
      lowercase: true,
      index: true,
    },

    tags: {
      type: [String],
      default: [],
      lowercase: true,
    },

    // ================= PRICING =================
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    // ================= MEDIA =================
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one image is required',
      },
    },

    // ================= INVENTORY =================
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    sizes: {
      type: [String],
      default: [],
    },

    weight: {
      type: Number,
      min: 0,
      default: null, // grams
    },

    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    // ================= STATUS & FLAGS =================
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ================= RATINGS (FUTURE-SAFE) =================
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    // ================= META =================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//
// ================= INDEXES =================
//
productSchema.index({ category: 1, status: 1 });
productSchema.index({ material: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1, status: 1 });
productSchema.index({ createdAt: -1 });

//
// ================= VIRTUALS =================
//

// Discount %
productSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Stock availability (purely informational)
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

//
// ================= INSTANCE METHODS =================
//

// Availability check (status-aware)
productSchema.methods.isAvailable = function (qty = 1) {
  return this.status === 'active' && this.stock >= qty;
};

// Stock management
productSchema.methods.decreaseStock = async function (qty) {
  if (this.stock < qty) {
    throw new Error('Insufficient stock');
  }
  this.stock -= qty;
  await this.save();
};

productSchema.methods.increaseStock = async function (qty) {
  this.stock += qty;
  await this.save();
};

//
// ================= HOOKS =================
//

// Auto-generate SKU on first save
productSchema.pre('save', async function (next) {
  if (!this.sku && this.isNew) {
    const categoryPrefix = this.category
      ? this.category.substring(0, 4).toUpperCase()
      : 'PROD';

    const materialPrefix = this.material
      ? this.material.substring(0, 4).toUpperCase()
      : 'GEN';

    const latest = await mongoose
      .model('Product')
      .findOne({ sku: new RegExp(`^${categoryPrefix}-${materialPrefix}-`) })
      .sort({ sku: -1 });

    let seq = 1;
    if (latest?.sku) {
      seq = parseInt(latest.sku.split('-')[2]) + 1;
    }

    this.sku = `${categoryPrefix}-${materialPrefix}-${String(seq).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
