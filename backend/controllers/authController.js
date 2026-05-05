const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================
// SIGNUP
// ======================
exports.signup = async (req, res) => {
  try {
    let { name, email, password, role, adminKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.toLowerCase();

    // ⚡ faster query
    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ⚡ REDUCED SALT ROUNDS (FAST)
    const hashedPassword = await bcrypt.hash(password, 8);

    let userRole = "member";

    if (role === "admin" && adminKey === process.env.ADMIN_SECRET) {
      userRole = "admin";
    }

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
    res.status(500).json({ message: "Signup failed" });
  }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
  try {
    console.time("LOGIN"); // ⏱ debug

    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = email.toLowerCase();

    // ⚡ lean = faster
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ⚡ compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.timeEnd("LOGIN"); // ⏱ debug

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
    res.status(500).json({ message: "Login failed" });
  }
};