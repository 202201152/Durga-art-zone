/**
 * Role-Based Access Control (RBAC) middleware
 * 
 * Roles:
 * - 'user': Regular customer
 * - 'admin': Platform administrator
 * - 'delivery_partner': Delivery personnel
 * 
 * Usage:
 * - authorize('admin') - Only admin
 * - authorize('admin', 'delivery_partner') - Admin or delivery partner
 */

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

module.exports = authorize;


