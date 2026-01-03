const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken } = require('../utils/generateToken');

/**
 * Authentication Controller
 * Handles all authentication-related operations
 */

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone: phone || undefined
  });

  // Generate JWT token
  const token = user.getSignedJwtToken();

  // Remove password from response
  user.password = undefined;

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Check for user and include password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Your account has been deactivated. Please contact support.'
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Generate JWT token
  const token = user.getSignedJwtToken();

  // Remove password from response
  user.password = undefined;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture
    }
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  // req.user is already populated by protect middleware
  // But let's fetch fresh data from database
  const userId = req.user._id || req.user.id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID not found in request'
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture,
      address: user.address,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  // Since we're using JWT tokens, logout is handled client-side
  // by removing the token. However, we can maintain a token blacklist
  // for enhanced security (optional implementation)

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @desc    Update user details
 * @route   PUT /api/v1/auth/updatedetails
 * @access  Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key =>
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  // Don't allow email update if user has Google account
  if (req.body.email && req.user.googleId) {
    return res.status(400).json({
      success: false,
      message: 'Cannot update email for Google-authenticated accounts'
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Details updated successfully',
    data: user
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/v1/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password'
    });
  }

  // Get user with password field
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Check if user has password (Google OAuth users might not)
  if (!user.password) {
    return res.status(400).json({
      success: false,
      message: 'Password not set for this account. Please set a password first.'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Generate new token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
    token
  });
});

/**
 * @desc    Forgot password - send reset token
 * @route   POST /api/v1/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email address'
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if user exists or not (security best practice)
    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent'
    });
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // In production, send email with reset link
  // For now, we'll just return the token in development
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

  if (process.env.NODE_ENV === 'development') {
    res.status(200).json({
      success: true,
      message: 'Password reset token generated',
      resetToken, // Only in development
      resetUrl
    });
  } else {
    // In production, send email here
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Password Reset Request',
    //   message: `Click here to reset password: ${resetUrl}`
    // });

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent'
    });
  }
});

/**
 * @desc    Reset password
 * @route   PUT /api/v1/auth/resetpassword/:resettoken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Generate new token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
    token
  });
});

/**
 * @desc    Google OAuth callback handler
 * @route   GET /api/v1/auth/google/callback
 * @access  Public
 */
exports.googleCallback = asyncHandler(async (req, res, next) => {
  // This will be called by Passport after Google authentication
  // The user object will be attached by Passport middleware
  if (!req.user) {
    return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`);
  }

  const token = req.user.getSignedJwtToken();

  // Redirect to frontend with token
  // In production, use a more secure method (HTTP-only cookie)
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});

