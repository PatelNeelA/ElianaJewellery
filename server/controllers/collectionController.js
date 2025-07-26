// controllers/collectionController.js
const Collection = require("../models/Collection");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // For file system operations (e.g., deleting old images)

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/collections");
    // Create the directory if it doesn't exist
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
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
}).single("collectionImage"); // 'collectionImage' is the field name for the file input

// @desc    Create a new collection
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

    const { name } = req.body;
    if (!name) {
      // If name is missing, delete the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Collection name is required." });
    }

    try {
      const newCollection = new Collection({
        name,
        imageUrl: `/uploads/collections/${req.file.filename}`, // Store public URL
      });

      const collection = await newCollection.save();
      res
        .status(201)
        .json({ message: "Collection created successfully", collection });
    } catch (error) {
      // If there's a DB error, delete the uploaded file
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

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public (or Admin, depending on your needs)
exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({});
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a collection
// @route   PUT /api/collections/:id
// @access  Admin
exports.updateCollection = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { id } = req.params;
    const { name } = req.body;
    let updateFields = { name };

    try {
      const collection = await Collection.findById(id);

      if (!collection) {
        if (req.file) fs.unlinkSync(req.file.path); // Clean up if collection not found
        return res.status(404).json({ message: "Collection not found." });
      }

      if (req.file) {
        // Delete old image if a new one is uploaded
        if (collection.imageUrl) {
          const oldImagePath = path.join(__dirname, "..", collection.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateFields.imageUrl = `/uploads/collections/${req.file.filename}`;
      } else if (!name) {
        // If neither name nor new image, return error
        return res.status(400).json({ message: "No update data provided." });
      }

      const updatedCollection = await Collection.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true } // Return the updated doc and run schema validators
      );

      res
        .status(200)
        .json({
          message: "Collection updated successfully",
          collection: updatedCollection,
        });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path); // Clean up if error occurs
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Collection with this name already exists." });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
// @access  Admin
exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    // Delete the associated image file from the server
    if (collection.imageUrl) {
      const imagePath = path.join(__dirname, "..", collection.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Collection.deleteOne({ _id: req.params.id }); // Use deleteOne or findByIdAndDelete
    res.status(200).json({ message: "Collection deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
