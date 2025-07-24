// config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected successfully! 🚀");
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message} 💥`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
