// server.js (UPDATED)
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const productRoutes = require("./routes/productRoutes"); // Import product routes
const blogRoutes = require("./routes/blogRoutes"); // Import blog routes
const contactRoutes = require("./routes/contactRoutes");
const orderRoutes = require("./routes/orderRoutes"); // Import order routes
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static uploaded files (e.g., collection images, product images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Ensure the /uploads/products directory is accessible
// The /uploads path will handle both /uploads/collections and /uploads/products

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/products", productRoutes); // Add product routes
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes); // Add order routes
// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🎉`));
