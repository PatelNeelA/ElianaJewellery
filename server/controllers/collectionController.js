// controllers/collectionController.js (MODIFIED - Added excludeTrending query)
const Collection = require("../models/Collection");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/collections");
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

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
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
}).single("collectionImage");

// @desc    Create a new collection (UNCHANGED)
// @route   POST /api/collections
// @access  Admin
exports.createCollection = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const { name, isTrending } = req.body;
    if (!name) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Collection name is required." });
    }

    try {
      const newCollection = new Collection({
        name,
        imageUrl: `/uploads/collections/${req.file.filename}`,
        isTrending: isTrending === "true",
      });

      const collection = await newCollection.save();
      res
        .status(201)
        .json({ message: "Collection created successfully", collection });
    } catch (error) {
      fs.unlinkSync(req.file.path);
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Collection with this name already exists." });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// @desc    Get all collections (optionally filter by isTrending or excludeTrending)
// @route   GET /api/collections
// @route   GET /api/collections?isTrending=true
// @route   GET /api/collections?excludeTrending=true
// @access  Public
exports.getCollections = async (req, res) => {
  try {
    const { isTrending, excludeTrending } = req.query;
    let query = {};

    if (isTrending === "true") {
      // Only get trending collections
      query.isTrending = true;
    } else if (excludeTrending === "true") {
      // Exclude trending collections
      query.isTrending = false;
    }
    // If neither isTrending nor excludeTrending, get all collections

    const collections = await Collection.find(query).sort({ createdAt: -1 });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a collection (UNCHANGED)
// @route   PUT /api/collections/:id
// @access  Admin
exports.updateCollection = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { id } = req.params;
    const { name, isTrending } = req.body;
    let updateFields = {};

    if (name) updateFields.name = name;
    if (isTrending !== undefined)
      updateFields.isTrending = isTrending === "true";

    try {
      const collection = await Collection.findById(id);
      if (!collection) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "Collection not found." });
      }

      if (req.file) {
        if (collection.imageUrl) {
          const oldImagePath = path.join(__dirname, "..", collection.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateFields.imageUrl = `/uploads/collections/${req.file.filename}`;
      } else if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No update data provided." });
      }

      const updatedCollection = await Collection.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      );

      res
        .status(200)
        .json({
          message: "Collection updated successfully",
          collection: updatedCollection,
        });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Collection with this name already exists." });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// @desc    Delete a collection (UNCHANGED)
// @route   DELETE /api/collections/:id
// @access  Admin
exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    if (collection.imageUrl) {
      const imagePath = path.join(__dirname, "..", collection.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Collection.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Collection deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
