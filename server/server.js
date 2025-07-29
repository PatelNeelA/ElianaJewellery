// server.js (Combined with previous CORS fix and PORT from .env)
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const productRoutes = require("./routes/productRoutes");
const blogRoutes = require("./routes/blogRoutes");
const contactRoutes = require("./routes/contactRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Load environment variables
dotenv.config();

// --- Hardcoded Frontend URL for CORS (as per your previous request) ---
const allowedOrigin = "https://elianajewellery-frontend.onrender.com"; // Or an array if multiple: ['http://localhost:5173', 'https://www.yourdomain.com']
// --- END Hardcoded Frontend URL ---

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        (Array.isArray(allowedOrigin)
          ? allowedOrigin.includes(origin)
          : origin === allowedOrigin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// --- PORT from environment variable or default to 5000 ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🎉`));
