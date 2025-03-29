import passport from "passport"
import generateToken from "../utils/generateToken.js"

// @desc    Auth with Google
// @route   GET /api/auth/google
// @access  Public
const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] })

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) {
      console.error("Google auth error:", err)
      return next(err)
    }

    if (!user) {
      return res.redirect(
        process.env.NODE_ENV === "production"
          ? "https://project-2-xgs8.onrender.com/login?error=auth_failed"
          : "http://localhost:3000/login?error=auth_failed",
      )
    }

    // Generate JWT token
    generateToken(res, user._id)

    // Redirect to frontend
    res.redirect(
      process.env.NODE_ENV === "production" ? "https://project-2-xgs8.onrender.com/" : "http://localhost:3000/",
    )
  })(req, res, next)
}

// @desc    Check if user is authenticated
// @route   GET /api/auth/status
// @access  Public
const getAuthStatus = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    })
  } else {
    res.json({ isAuthenticated: false })
  }
}

export { googleAuth, googleAuthCallback, getAuthStatus }

