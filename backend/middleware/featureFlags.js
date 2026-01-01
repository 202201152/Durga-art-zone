const config = require('../config');

/**
 * Feature Flags Middleware
 * 
 * Allows enabling/disabling features without code deployment
 * Features are controlled via ENABLED_FEATURES environment variable
 * 
 * Usage:
 * router.get('/checkout', checkFeatureFlag('checkout'), checkoutHandler);
 */

const checkFeatureFlag = (featureName) => {
  return (req, res, next) => {
    if (!config.enabledFeatures.includes(featureName)) {
      return res.status(503).json({
        success: false,
        message: `Feature '${featureName}' is currently disabled`
      });
    }
    next();
  };
};

/**
 * Helper function to check if a feature is enabled
 * Can be used in routes, services, or anywhere in the code
 */
const isFeatureEnabled = (featureName) => {
  return config.enabledFeatures.includes(featureName);
};

module.exports = {
  checkFeatureFlag,
  isFeatureEnabled
};


