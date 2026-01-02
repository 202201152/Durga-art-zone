const mongoose = require('mongoose');

/**
 * Product Schema
 * Jewelry products with categories, sizes, materials, and inventory tracking
 */

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: ['bracelet', 'earrings', 'rings', 'chains'],
    lowercase: true
  },
  material: {
    type: String,
    required: [true, 'Please provide material type'],
    enum: ['Gold', 'Silver'],
    default: 'Gold'
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
    default: null
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock count'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sizes: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        // Validate size format (e.g., "Small", "Medium", "Large", or specific measurements)
        return v.every(size => typeof size === 'string' && size.trim().length > 0);
      },
      message: 'Each size must be a non-empty string'
    }
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true // Index for faster queries of active products
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true, // Allows nulls but enforces uniqueness for non-null values
    trim: true,
    uppercase: true
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
    default: null // Weight in grams
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  tags: {
    type: [String],
    default: [],
    lowercase: true
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ material: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1, isActive: 1 });
productSchema.index({ 'ratings.average': -1 }); // For sorting by rating
productSchema.index({ createdAt: -1 }); // For sorting by newest

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Method to check if product is available
productSchema.methods.isAvailable = function(quantity = 1) {
  return this.isActive && this.stock >= quantity;
};

// Method to decrease stock
productSchema.methods.decreaseStock = async function(quantity) {
  if (this.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  this.stock -= quantity;
  await this.save();
};

// Method to increase stock
productSchema.methods.increaseStock = async function(quantity) {
  this.stock += quantity;
  await this.save();
};

// Pre-save hook to generate SKU if not provided
productSchema.pre('save', async function(next) {
  if (!this.sku && this.isNew) {
    // Generate SKU: CATEGORY-MATERIAL-XXXX (e.g., BRACELET-GOLD-0001)
    const categoryPrefix = this.category.substring(0, 4).toUpperCase();
    const materialPrefix = this.material.substring(0, 4).toUpperCase();
    
    // Find the latest product with similar prefix
    const latestProduct = await mongoose.model('Product')
      .findOne({ sku: new RegExp(`^${categoryPrefix}-${materialPrefix}-`) })
      .sort({ sku: -1 });
    
    let sequence = 1;
    if (latestProduct && latestProduct.sku) {
      const lastSequence = parseInt(latestProduct.sku.split('-')[2] || '0');
      sequence = lastSequence + 1;
    }
    
    this.sku = `${categoryPrefix}-${materialPrefix}-${String(sequence).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);

