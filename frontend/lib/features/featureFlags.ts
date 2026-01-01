/**
 * Feature Flags Client
 * 
 * This module allows the frontend to check if features are enabled.
 * Features can be toggled via environment variables or API.
 * 
 * Usage:
 * if (isFeatureEnabled('checkout')) {
 *   // Show checkout button
 * }
 */

// Features list - should match backend feature flags
export type FeatureFlag = 
  | 'cart'
  | 'checkout'
  | 'razorpay'
  | 'cod'
  | 'google-auth'
  | 'wishlist'
  | 'reviews';

/**
 * Check if a feature is enabled
 * Can be extended to fetch from API for dynamic feature flags
 */
export const isFeatureEnabled = (feature: FeatureFlag): boolean => {
  // For now, all features are enabled in development
  // In production, this can fetch from API or use environment variables
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    return true;
  }

  // TODO: Fetch from API endpoint /api/v1/features
  // For now, return true for all
  return true;
};

/**
 * Get all enabled features
 */
export const getEnabledFeatures = async (): Promise<FeatureFlag[]> => {
  // TODO: Fetch from API
  return ['cart', 'checkout', 'razorpay', 'cod', 'google-auth'];
};


