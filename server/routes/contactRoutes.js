// routes/contactRoutes.js
const express = require("express");
const {
  submitContactMessage,
  getAllContactMessages,
  deleteContactMessage,
} = require("../controllers/contactController");
// const { protect, authorize } = require('../middleware/authMiddleware'); // For admin routes

const router = express.Router();

router.route("/").post(submitContactMessage).get(getAllContactMessages); // GET should be admin-protected
router.route("/:id").delete(deleteContactMessage); // DELETE should be admin-protected

module.exports = router;
