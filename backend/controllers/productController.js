const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Product Controller
 * Handles all product-related operations
 */

/**
 * @desc    Get all products (with filtering, sorting, pagination)
 * @route   GET /api/v1/products
 * @access  Public
 */
exports.getProducts = asyncHandler(async (req, res, next) => {
  const {
    category,
    material,
    minPrice,
    maxPrice,
    inStock,
    featured,
    search,
    sort,
    page = 1,
    limit = 12
  } = req.query;

  // Build query object
  const query = {};

  // Only show active products for non-admin users
  if (req.user?.role !== 'admin') {
    query.isActive = true;
  }

  // Filter by category
  if (category) {
    query.category = category.toLowerCase();
  }

  // Filter by material
  if (material) {
    query.material = material;
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Filter by stock availability
  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  }

  // Filter featured products
  if (featured === 'true') {
    query.featured = true;
  }

  // Search by name or description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Sort options
  let sortBy = { createdAt: -1 }; // Default: newest first
  if (sort) {
    switch (sort) {
      case 'price-asc':
        sortBy = { price: 1 };
        break;
      case 'price-desc':
        sortBy = { price: -1 };
        break;
      case 'name-asc':
        sortBy = { name: 1 };
        break;
      case 'name-desc':
        sortBy = { name: -1 };
        break;
      case 'rating':
        sortBy = { 'ratings.average': -1 };
        break;
      case 'oldest':
        sortBy = { createdAt: 1 };
        break;
      default:
        sortBy = { createdAt: -1 };
    }
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const products = await Product.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(limitNum)
    .select('-__v');

  // Get total count for pagination
  const total = await Product.countDocuments(query);

  // Pagination metadata
  const pagination = {
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum)
  };

  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products
  });
});

/**
 * @desc    Get single product
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
  const query = { _id: req.params.id };
  
  // Non-admin users can only see active products
  if (req.user?.role !== 'admin') {
    query.isActive = true;
  }

  const product = await Product.findOne(query);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Create new product
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
exports.createProduct = asyncHandler(async (req, res, next) => {
  const productData = {
    ...req.body,
    createdBy: req.user.id
  };

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

/**
 * @desc    Update product
 * @route   PUT /api/v1/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Update product
  product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

/**
 * @desc    Get products by category
 * @route   GET /api/v1/products/category/:category
 * @access  Public
 */
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params;
  const { page = 1, limit = 12, sort } = req.query;

  const query = { category: category.toLowerCase() };
  
  if (req.user?.role !== 'admin') {
    query.isActive = true;
  }

  // Sort options
  let sortBy = { createdAt: -1 };
  if (sort) {
    switch (sort) {
      case 'price-asc':
        sortBy = { price: 1 };
        break;
      case 'price-desc':
        sortBy = { price: -1 };
        break;
      default:
        sortBy = { createdAt: -1 };
    }
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(limitNum);

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    count: products.length,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    },
    data: products
  });
});

/**
 * @desc    Get featured products
 * @route   GET /api/v1/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const { limit = 8 } = req.query;

  const query = {
    featured: true,
    isActive: true,
    stock: { $gt: 0 }
  };

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

/**
 * @desc    Update product stock
 * @route   PATCH /api/v1/products/:id/stock
 * @access  Private/Admin
 */
exports.updateStock = asyncHandler(async (req, res, next) => {
  const { stock } = req.body;

  if (stock === undefined || stock < 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid stock quantity'
    });
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  product.stock = stock;
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Stock updated successfully',
    data: product
  });
});




