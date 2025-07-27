// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  productDetails: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Unisex", "Kids"], // Example categories
    required: true,
  },
  occasion: {
    type: String,
    required: true,
  },
  materialColor: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  // Link to the Collection model
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection", // This references the 'Collection' model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
