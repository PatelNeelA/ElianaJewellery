// routes/blogRoutes.js
const express = require("express");
const {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
} = require("../controllers/blogController");
// const { protect, authorize } = require('../middleware/authMiddleware'); // Example for admin access

const router = express.Router();

router.route("/").post(createBlogPost).get(getAllBlogPosts);
router
  .route("/:id")
  .get(getBlogPostById)
  .put(updateBlogPost)
  .delete(deleteBlogPost);

module.exports = router;
