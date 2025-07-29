// routes/orderRoutes.js
const express = require("express");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
// const { protect, authorize } = require('../middleware/authMiddleware'); // For admin/user routes

const router = express.Router();

router.post("/create", createRazorpayOrder); // Public for now, could be user-protected
router.post("/verify", verifyRazorpayPayment); // Public, called by frontend after Razorpay callback

// Admin routes for managing orders
router.route("/").get(getAllOrders); // Should be admin-protected

router
  .route("/:id")
  .put(updateOrderStatus) // Should be admin-protected (for status updates)
  .delete(deleteOrder); // Should be admin-protected

module.exports = router;
