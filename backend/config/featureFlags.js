/**
 * Feature Flags Configuration
 * 
 * Centralized feature flag definitions
 * Makes it easy to add new features and manage them
 */

const FEATURES = {
  CART: 'cart',
  CHECKOUT: 'checkout',
  RAZORPAY: 'razorpay',
  COD: 'cod',
  GOOGLE_AUTH: 'google-auth',
  WISHLIST: 'wishlist',
  REVIEWS: 'reviews',
  DELIVERY_TRACKING: 'delivery-tracking',
  ADMIN_DASHBOARD: 'admin-dashboard',
};

/**
 * Get feature flag status
 * Can be extended to check database or external service
 */
const getFeatureStatus = (featureName) => {
  const config = require('./index');
  return config.enabledFeatures.includes(featureName);
};

module.exports = {
  FEATURES,
  getFeatureStatus,
};


