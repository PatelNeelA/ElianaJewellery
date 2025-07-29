// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to your User model (if you have one)
    default: null, // Allow guest users
  },
  buyerDetails: {
    // Details from the contact form
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: String,
      imageUrl: String,
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
    status: {
      type: String,
      enum: ["created", "pending", "paid", "failed"],
      default: "created",
    },
  },
  status: {
    // Overall order status
    type: String,
    enum: [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
