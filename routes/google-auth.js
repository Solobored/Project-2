const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth Login
 *     description: Redirect to Google for authentication
 *     tags: 
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen
 *       500:
 *         description: Server error during OAuth initiation
 */
router.get('/google', 
  (req, res, next) => {
    // Add logging to help diagnose issues
    console.log('Google OAuth Request Received');
    next();
  },
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth Callback
 *     description: Handle callback from Google after authentication
 *     tags: 
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirect after successful authentication
 *       500:
 *         description: Error during OAuth callback
 */
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  (req, res) => {
    // Generate JWT token or handle successful login
    res.redirect('/');
  }
);

module.exports = router;