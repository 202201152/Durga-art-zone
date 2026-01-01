/**
 * Async Handler Utility
 * Wraps async route handlers to automatically catch errors
 * Eliminates need for try-catch in every route handler
 * 
 * Usage:
 * router.get('/', asyncHandler(async (req, res) => {
 *   const data = await someAsyncOperation();
 *   res.json({ success: true, data });
 * }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;


