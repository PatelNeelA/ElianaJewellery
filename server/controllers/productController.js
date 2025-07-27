// controllers/productController.js
const Product = require("../models/Product");
const Collection = require("../models/Collection"); // Import Collection to validate collection ID
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // For file system operations

// Set up storage for uploaded product images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/products");
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
}).single("productImage"); // 'productImage' is the field name for the file input

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
exports.createProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const {
      name,
      productDetails,
      price,
      gender,
      occasion,
      materialColor,
      collection,
    } = req.body;

    if (
      !name ||
      !productDetails ||
      !price ||
      !gender ||
      !occasion ||
      !materialColor ||
      !collection
    ) {
      fs.unlinkSync(req.file.path); // Delete uploaded file if other fields are missing
      return res
        .status(400)
        .json({ message: "All product fields are required." });
    }

    // Validate collection ID
    try {
      const existingCollection = await Collection.findById(collection);
      if (!existingCollection) {
        fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({ message: "Invalid collection ID provided." });
      }

      const newProduct = new Product({
        name,
        productDetails,
        price,
        gender,
        occasion,
        materialColor,
        imageUrl: `/uploads/products/${req.file.filename}`, // Store public URL
        collection, // Store the collection ObjectId
      });

      const product = await newProduct.save();
      res
        .status(201)
        .json({ message: "Product created successfully", product });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path); // Clean up if DB error occurs
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// @desc    Get all products (optionally by collection)
// @route   GET /api/products
// @route   GET /api/products?collectionId=...
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { collectionId } = req.query;
    let query = {};
    if (collectionId) {
      query.collection = collectionId;
    }
    const products = await Product.find(query).populate("collection", "name"); // Populate collection name
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "collection",
      "name"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { id } = req.params;
    const {
      name,
      productDetails,
      price,
      gender,
      occasion,
      materialColor,
      collection,
    } = req.body;
    let updateFields = {};

    // Only add fields to updateFields if they are provided in the request body
    if (name) updateFields.name = name;
    if (productDetails) updateFields.productDetails = productDetails;
    if (price) updateFields.price = price;
    if (gender) updateFields.gender = gender;
    if (occasion) updateFields.occasion = occasion;
    if (materialColor) updateFields.materialColor = materialColor;
    if (collection) updateFields.collection = collection;

    try {
      const product = await Product.findById(id);

      if (!product) {
        if (req.file) fs.unlinkSync(req.file.path); // Clean up if product not found
        return res.status(404).json({ message: "Product not found." });
      }

      // If a new image is uploaded, delete the old one
      if (req.file) {
        if (product.imageUrl) {
          const oldImagePath = path.join(__dirname, "..", product.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateFields.imageUrl = `/uploads/products/${req.file.filename}`;
      } else if (Object.keys(updateFields).length === 0) {
        // If no file and no other fields provided, nothing to update
        return res.status(400).json({ message: "No update data provided." });
      }

      // If collection ID is provided, validate it
      if (collection) {
        const existingCollection = await Collection.findById(collection);
        if (!existingCollection) {
          if (req.file) fs.unlinkSync(req.file.path); // Clean up if invalid collection
          return res
            .status(400)
            .json({ message: "Invalid collection ID provided." });
        }
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      }).populate("collection", "name");

      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path); // Clean up if error occurs
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Delete the associated image file from the server
    if (product.imageUrl) {
      const imagePath = path.join(__dirname, "..", product.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
