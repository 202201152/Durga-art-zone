const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 */

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.headers.authorization) {
      // Token without "Bearer " prefix
      token = req.headers.authorization;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please provide a valid token.'
      });
    }

    try {
      // Verify token
      if (!config.jwt.secret) {
        return res.status(500).json({
          success: false,
          message: 'Server configuration error: JWT secret not set'
        });
      }

      const decoded = jwt.verify(token, config.jwt.secret);

      // Support both 'id' and '_id' from token
      const userId = decoded.id || decoded._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token format'
        });
      }

      // Validate MongoDB ObjectId format
      const mongoose = require('mongoose');
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
      }

      // Get user from token
      req.user = await User.findById(userId).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token may be invalid or user may have been deleted.'
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated. Please contact support.'
        });
      }

      next();
    } catch (error) {
      // Handle specific JWT errors
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.'
        });
      }

      // Handle MongoDB cast errors (invalid ID format)
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format in token'
        });
      }

      // Generic error
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = protect;


