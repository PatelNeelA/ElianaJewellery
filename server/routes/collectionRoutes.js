// routes/collectionRoutes.js
const express = require("express");
const {
  createCollection,
  getCollections,
  updateCollection,
  deleteCollection,
} = require("../controllers/collectionController");
// You would typically add middleware here for admin authentication/authorization
// const { protect, authorize } = require('../middleware/authMiddleware'); // Example

const router = express.Router();

router.route("/").post(createCollection).get(getCollections); // Add protect/authorize for POST if needed
router
  .route("/:id")
  .put(updateCollection) // Add protect/authorize
  .delete(deleteCollection); // Add protect/authorize

module.exports = router;
