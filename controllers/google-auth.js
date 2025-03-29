const User = require('../models/user');

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = async (req, res) => {
  try {
    // The user is already set by passport
    const token = req.user.getSignedJwtToken();
    const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
      options.secure = true;
      options.sameSite = "none";
    }

    // For Google OAuth, redirect to home with token
    res.status(200).cookie("token", token, options).redirect("/");
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect('/login?error=auth_failed');
  }
};