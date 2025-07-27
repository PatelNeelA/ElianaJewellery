// routes/productRoutes.js
const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
// const { protect, authorize } = require('../middleware/authMiddleware'); // Example for admin access

const router = express.Router();

// Routes for all products and creating a product
router.route("/").post(createProduct).get(getProducts);

// Routes for specific product by ID
router
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
