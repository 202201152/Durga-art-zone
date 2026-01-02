const express = require('express');
const router = express.Router();

// Import controllers
const productController = require('../controllers/productController');

// Import middleware
const protect = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const { validateCreateProduct, validateUpdateProduct } = require('../middleware/productValidator');

/**
 * Product Routes
 * 
 * GET    /api/v1/products              - Get all products (with filters)
 * GET    /api/v1/products/:id          - Get single product
 * GET    /api/v1/products/category/:category - Get products by category
 * GET    /api/v1/products/featured     - Get featured products
 * POST   /api/v1/products              - Create product (Admin only)
 * PUT    /api/v1/products/:id          - Update product (Admin only)
 * DELETE /api/v1/products/:id          - Delete product (Admin only)
 * PATCH  /api/v1/products/:id/stock    - Update stock (Admin only)
 */

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProduct);

// Admin-only routes
router.post(
  '/',
  protect,
  authorize('admin'),
  validateCreateProduct,
  productController.createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validateUpdateProduct,
  productController.updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  productController.deleteProduct
);

router.patch(
  '/:id/stock',
  protect,
  authorize('admin'),
  productController.updateStock
);

module.exports = router;

