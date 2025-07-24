// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Helper function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this username" });
    }

    // Create new user with default 'user' role
    const user = await User.create({
      username,
      email,
      password,
      role: "user", // Default role
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Authenticate user & get token (for normal users)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Check if the user is a normal user (not admin trying to use this route)
      if (user.role === "admin") {
        return res
          .status(403)
          .json({ message: "Access denied. Please use the admin login." });
      }

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Authenticate admin & get token
// @route   POST /api/auth/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin user exists
    const admin = await User.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      // Ensure the user has the 'admin' role
      if (admin.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Access denied. You are not an administrator." });
      }

      res.json({
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id, admin.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password for admin" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during admin login" });
  }
};

// @desc    Get user profile (protected route example)
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // req.user is available due to 'protect' middleware
  res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  getUserProfile,
};
