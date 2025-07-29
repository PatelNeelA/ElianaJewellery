// controllers/orderController.js
const Order = require("../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto"); // Node.js built-in module for crypto operations
const dotenv = require("dotenv");

dotenv.config();

// Initialize Razorpay instance with your keys
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order and save initial order in DB
// @route   POST /api/orders/create
// @access  Public (or Protected if users must be logged in)
exports.createRazorpayOrder = async (req, res) => {
  const { cartItems, totalPrice, buyerDetails } = req.body;

  if (!cartItems || cartItems.length === 0 || !totalPrice || !buyerDetails) {
    return res.status(400).json({ message: "Missing required order details." });
  }

  // Convert total amount to smallest currency unit (paise for INR)
  const amount = Math.round(totalPrice * 100); // Razorpay expects amount in paise

  const options = {
    amount: amount,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`, // Unique receipt ID
    payment_capture: 1, // Auto capture payment after success
  };

  try {
    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Save initial order details to your database with 'created' status
    const newOrder = new Order({
      buyerDetails: buyerDetails,
      items: cartItems.map((item) => ({
        product: item._id, // Reference to actual product ID
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: totalPrice,
      razorpay: {
        orderId: razorpayOrder.id,
        status: "created",
      },
      status: "pending", // Overall order status
    });

    await newOrder.save();

    res.status(200).json({
      order_id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      key_id: process.env.RAZORPAY_KEY_ID, // Send key_id to frontend
    });
  } catch (error) {
    console.error("Error creating Razorpay order or saving to DB:", error);
    res
      .status(500)
      .json({
        message: "Failed to create Razorpay order.",
        error: error.message,
      });
  }
};

// @desc    Verify Razorpay payment and update order status
// @route   POST /api/orders/verify
// @access  Public (or Protected if callback is from your server after successful payment)
exports.verifyRazorpayPayment = async (req, res) => {
  const { orderId, paymentId, signature } = req.body; // Data from Razorpay callback on frontend

  // Important: This is the server-side verification using your secret key
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === signature;

  if (isAuthentic) {
    try {
      const order = await Order.findOneAndUpdate(
        { "razorpay.orderId": orderId },
        {
          $set: {
            "razorpay.paymentId": paymentId,
            "razorpay.signature": signature,
            "razorpay.status": "paid",
            status: "processing", // Update overall order status
            updatedAt: Date.now(),
          },
        },
        { new: true }
      );

      if (!order) {
        return res
          .status(404)
          .json({ message: "Order not found in DB after verification." });
      }

      // Here you would also:
      // 1. Clear user's cart (if applicable)
      // 2. Send order confirmation email to customer
      // 3. Update inventory/stock levels

      res
        .status(200)
        .json({
          message: "Payment verified successfully and order updated.",
          orderId: order.razorpay.orderId,
        });
    } catch (error) {
      console.error("Error updating order after verification:", error);
      res
        .status(500)
        .json({
          message: "Payment verified, but failed to update order status.",
          error: error.message,
        });
    }
  } else {
    // Payment verification failed
    try {
      await Order.findOneAndUpdate(
        { "razorpay.orderId": orderId },
        {
          $set: {
            "razorpay.paymentId": paymentId, // Still save paymentId if available
            "razorpay.signature": signature,
            "razorpay.status": "failed",
            status: "failed",
            updatedAt: Date.now(),
          },
        }
      );
    } catch (dbError) {
      console.error("Error updating order status to failed:", dbError);
    }
    res
      .status(400)
      .json({ message: "Payment verification failed: Invalid signature." });
  }
};

// @desc    Get all orders (for Admin)
// @route   GET /api/orders
// @access  Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("items.product", "name price imageUrl") // Populate product details
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update order status (for Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: "Order status is required." });
  }
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate("items.product", "name price imageUrl");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete an order (for Admin)
// @route   DELETE /api/orders/:id
// @access  Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
