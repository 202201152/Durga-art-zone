const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate JWT Token
 * Utility function to create JWT tokens with consistent configuration
 */
const generateToken = (payload, expiresIn = null) => {
  return jwt.sign(
    payload,
    config.jwt.secret,
    {
      expiresIn: expiresIn || config.jwt.expire
    }
  );
};

/**
 * Verify JWT Token
 * Utility function to verify and decode JWT tokens
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken
};


