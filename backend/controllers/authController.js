const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================
// SIGNUP
// ======================
exports.signup = async (req, res) => {
  try {

    // ================= GET DATA =================
    let {
      name,
      email,
      password,
      role,
      adminKey,
    } = req.body;

    // ================= DEBUG LOGS =================
    console.log("BODY:", req.body);
    console.log("ROLE:", role);
    console.log("ADMIN KEY:", adminKey);
    console.log("ENV SECRET:", process.env.ADMIN_SECRET);

    // ================= VALIDATION =================
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ================= FORMAT EMAIL =================
    email = email.toLowerCase().trim();

    // ================= CHECK EXISTING USER =================
    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ================= DEFAULT ROLE =================
    let userRole = "member";

    // ================= ADMIN SECURITY =================
    if (role === "admin") {

      // Check admin key exists
      if (!adminKey) {
        return res.status(403).json({
          success: false,
          message: "Admin secret key is required",
        });
      }

      // Remove extra spaces
      const cleanAdminKey = adminKey.trim();

      // Check admin key matches
      if (cleanAdminKey !== process.env.ADMIN_SECRET) {

        console.log("❌ Admin key mismatch");

        return res.status(403).json({
          success: false,
          message: "Invalid admin secret key",
        });
      }

      // Make admin
      userRole = "admin";

      console.log("✅ ADMIN CREATED");
    }

    // ================= HASH PASSWORD =================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ================= CREATE USER =================
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // ================= SUCCESS RESPONSE =================
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error("❌ Signup Error:", error);

    res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
  try {

    console.time("LOGIN");

    let { email, password } = req.body;

    // ================= VALIDATION =================
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ================= FORMAT EMAIL =================
    email = email.toLowerCase().trim();

    // ================= FIND USER =================
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ================= CHECK PASSWORD =================
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ================= GENERATE TOKEN =================
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.timeEnd("LOGIN");

    // ================= SUCCESS RESPONSE =================
    res.status(200).json({
      success: true,
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

    console.error("❌ Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};