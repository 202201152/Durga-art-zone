const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const config = require('./index');

/**
 * Passport Configuration for Google OAuth
 * Only loads if Google OAuth credentials are configured
 */

if (config.google.clientId && config.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackUrl
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists with this Google ID
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // User exists, return user
            return done(null, user);
          }

          // Check if user exists with same email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // User exists but doesn't have Google ID, link it
            user.googleId = profile.id;
            if (profile.photos && profile.photos[0]) {
              user.profilePicture = profile.photos[0].value;
            }
            user.isEmailVerified = true; // Google emails are verified
            await user.save();
            return done(null, user);
          }

          // New user, create account
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            isEmailVerified: true // Google emails are verified
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  console.log('✅ Google OAuth configured');
} else {
  console.log('⚠️ Google OAuth not configured (missing credentials)');
}

module.exports = passport;


