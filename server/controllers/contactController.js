// controllers/contactController.js
const ContactMessage = require("../models/ContactMessage");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv"); // To load environment variables

dotenv.config(); // Load .env variables

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Or 'SendGrid', 'Mailgun', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
  // If using a different service, you might need host and port
  // host: 'smtp.sendgrid.net',
  // port: 587,
  // secure: false, // true for 465, false for other ports
});

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
exports.submitContactMessage = async (req, res) => {
  const { fullName, email, phoneNumber, message } = req.body;

  if (!fullName || !email || !phoneNumber || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newContactMessage = new ContactMessage({
      fullName,
      email,
      phoneNumber,
      message,
    });

    const savedMessage = await newContactMessage.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: "pneel2710@gmail.com", // Your target email address
      subject: `New Contact Message from ${fullName} - Eliana Jewellery`,
      html: `
        <p>You have received a new contact message:</p>
        <ul>
          <li><strong>Full Name:</strong> ${fullName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone Number:</strong> ${phoneNumber}</li>
          <li><strong>Message:</strong><br>${message}</li>
        </ul>
        <p>---</p>
        <p>This message was sent from your Eliana Jewellery website contact form.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        // Don't necessarily return an error to the user for email failure,
        // as the message is already saved to DB. Log it.
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({
      message: "Message sent successfully!",
      contactMessage: savedMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin
exports.getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Admin
exports.deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }
    await ContactMessage.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
