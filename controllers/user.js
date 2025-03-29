const User = require("../models/user")

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      })
    }
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// @desc    Create new user
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with that email already exists",
      })
    }

    const user = await User.create(req.body)

    user.password = undefined

    res.status(201).json({
      success: true,
      data: user,
    })
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message)

      return res.status(400).json({
        success: false,
        error: messages,
      })
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    if (req.body.password) {
      delete req.body.password
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password")

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message)

      return res.status(400).json({
        success: false,
        error: messages,
      })
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      })
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    await user.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      })
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

