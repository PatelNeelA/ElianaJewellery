// routes/authRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  loginAdmin,
  getUserProfile,
} = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", loginAdmin);

// Protected routes (example)
router.get("/profile", protect, getUserProfile);
router.get("/admin/dashboard", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: `Welcome to the Admin Dashboard, ${req.user.username}!`,
  });
});
router.get("/user/dashboard", protect, authorizeRoles("user"), (req, res) => {
  res.json({
    message: `Welcome to your User Dashboard, ${req.user.username}!`,
  });
});

module.exports = router;
