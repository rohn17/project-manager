const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================
// SIGNUP
// ======================
exports.signup = async (req, res) => {
  try {
    let { name, email, password, role, adminKey } = req.body;

    // ================= VALIDATION =================
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Normalize email
    email = email.toLowerCase();

    // ================= CHECK EXISTING =================
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ================= HASH PASSWORD =================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ================= ROLE SECURITY =================
    let userRole = "member";

    // Allow admin only with secret key
    if (
      role === "admin" &&
      adminKey === process.env.ADMIN_SECRET
    ) {
      userRole = "admin";
    }

    // ================= CREATE USER =================
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("❌ Signup Error:", error.message);

    res.status(500).json({
      message: "Signup failed",
    });
  }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ================= VALIDATION =================
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Normalize email
    email = email.toLowerCase();

    // ================= FIND USER =================
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ================= PASSWORD CHECK =================
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // ================= TOKEN =================
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ================= RESPONSE =================
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("❌ Login Error:", error.message);

    res.status(500).json({
      message: "Login failed",
    });
  }
};