const express = require("express")
const passport = require("passport")
const router = express.Router()
const { googleCallback } = require("../controllers/google-auth")

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Google OAuth login
 *     description: Redirect to Google for authentication
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Callback URL for Google OAuth
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to home page with token
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback,
)

exports.googleCallback = (req, res) => {
  const token = req.user.getSignedJwtToken();
  
  res.cookie('token', token, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    httpOnly: true
  });

  res.redirect(process.env.FRONTEND_URI || 'http://localhost:3000');
};

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login-error',
    session: false 
  }),
  googleCallback
);

module.exports = router