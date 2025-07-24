// hashPassword.js
const bcrypt = require("bcryptjs");

async function hashAdminPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10); // Generates a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hashes the password
    console.log("Hashed Password:", hashedPassword);
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

// Replace 'your_admin_password_here' with the actual password you want for your admin
hashAdminPassword("Neel@2710"); // <-- Rerun this and copy the output
