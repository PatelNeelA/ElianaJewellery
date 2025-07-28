// controllers/blogController.js
const Blog = require("../models/Blog");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up storage for uploaded blog images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/blogs"); // Dedicated folder for blogs
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Configure multer to handle multiple files with different field names
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/; // Ensure .webp is supported
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        "Error: File upload only supports the following filetypes - " +
          filetypes
      )
    );
  },
}).fields([
  { name: "blogImage", maxCount: 1 }, // Field for main blog image
  { name: "authorImage", maxCount: 1 }, // Field for author image
]);

// Helper to delete files if something goes wrong
const deleteUploadedFiles = (files) => {
  if (files) {
    if (
      files.blogImage &&
      files.blogImage[0] &&
      fs.existsSync(files.blogImage[0].path)
    ) {
      fs.unlinkSync(files.blogImage[0].path);
    }
    if (
      files.authorImage &&
      files.authorImage[0] &&
      fs.existsSync(files.authorImage[0].path)
    ) {
      fs.unlinkSync(files.authorImage[0].path);
    }
  }
};

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Admin
exports.createBlogPost = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({ message: err.message });
    }

    if (!req.files || !req.files.blogImage || !req.files.authorImage) {
      deleteUploadedFiles(req.files);
      return res
        .status(400)
        .json({ message: "Both blog image and author image are required." });
    }

    const { title, description, authorName, authorRole, authorTextColor } =
      req.body;

    if (!title || !description || !authorName || !authorRole) {
      deleteUploadedFiles(req.files);
      return res
        .status(400)
        .json({ message: "All text fields are required for the blog post." });
    }

    try {
      const newBlogPost = new Blog({
        title,
        description,
        blogImageUrl: `/uploads/blogs/${req.files.blogImage[0].filename}`,
        authorName,
        authorRole,
        authorImageUrl: `/uploads/blogs/${req.files.authorImage[0].filename}`,
        authorTextColor: authorTextColor || "text-black", // Default if not provided
      });

      const blogPost = await newBlogPost.save();
      res
        .status(201)
        .json({ message: "Blog post created successfully", blogPost });
    } catch (error) {
      deleteUploadedFiles(req.files);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
exports.getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await Blog.find({}).sort({ createdAt: -1 }); // Order by newest first
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single blog post by ID
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlogPostById = async (req, res) => {
  try {
    const blogPost = await Blog.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found." });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Admin
exports.updateBlogPost = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({ message: err.message });
    }

    const { id } = req.params;
    const { title, description, authorName, authorRole, authorTextColor } =
      req.body;
    let updateFields = {};

    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (authorName !== undefined) updateFields.authorName = authorName;
    if (authorRole !== undefined) updateFields.authorRole = authorRole;
    if (authorTextColor !== undefined)
      updateFields.authorTextColor = authorTextColor;

    try {
      const blogPost = await Blog.findById(id);

      if (!blogPost) {
        deleteUploadedFiles(req.files);
        return res.status(404).json({ message: "Blog post not found." });
      }

      // Handle blog image update
      if (req.files && req.files.blogImage && req.files.blogImage[0]) {
        if (
          blogPost.blogImageUrl &&
          fs.existsSync(path.join(__dirname, "..", blogPost.blogImageUrl))
        ) {
          fs.unlinkSync(path.join(__dirname, "..", blogPost.blogImageUrl));
        }
        updateFields.blogImageUrl = `/uploads/blogs/${req.files.blogImage[0].filename}`;
      }

      // Handle author image update
      if (req.files && req.files.authorImage && req.files.authorImage[0]) {
        if (
          blogPost.authorImageUrl &&
          fs.existsSync(path.join(__dirname, "..", blogPost.authorImageUrl))
        ) {
          fs.unlinkSync(path.join(__dirname, "..", blogPost.authorImageUrl));
        }
        updateFields.authorImageUrl = `/uploads/blogs/${req.files.authorImage[0].filename}`;
      }

      if (Object.keys(updateFields).length === 0 && !req.files) {
        return res.status(400).json({ message: "No update data provided." });
      }

      const updatedBlogPost = await Blog.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      });

      res
        .status(200)
        .json({
          message: "Blog post updated successfully",
          blogPost: updatedBlogPost,
        });
    } catch (error) {
      deleteUploadedFiles(req.files);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Admin
exports.deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await Blog.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found." });
    }

    // Delete associated image files
    if (
      blogPost.blogImageUrl &&
      fs.existsSync(path.join(__dirname, "..", blogPost.blogImageUrl))
    ) {
      fs.unlinkSync(path.join(__dirname, "..", blogPost.blogImageUrl));
    }
    if (
      blogPost.authorImageUrl &&
      fs.existsSync(path.join(__dirname, "..", blogPost.authorImageUrl))
    ) {
      fs.unlinkSync(path.join(__dirname, "..", blogPost.authorImageUrl));
    }

    await Blog.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Blog post deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
