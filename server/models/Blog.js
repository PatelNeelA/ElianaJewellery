// models/Blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    // Renamed from 'desc' for clarity in schema
    type: String,
    required: true,
    trim: true,
  },
  blogImageUrl: {
    // Main image for the blog post
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
    trim: true,
  },
  authorRole: {
    type: String,
    required: true,
    trim: true,
  },
  authorImageUrl: {
    // Image for the author
    type: String,
    required: true,
  },
  authorTextColor: {
    // Optional: to store 'text-black' or 'text-[#13524A]'
    type: String,
    default: "text-black", // Default color
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
