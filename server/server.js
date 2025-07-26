// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); // Import path module
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const collectionRoutes = require("./routes/collectionRoutes"); // Import collection routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Body parser for JSON data

// Serve static uploaded files (e.g., collection images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes); // Add collection routes

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🎉`));
