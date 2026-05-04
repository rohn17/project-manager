const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// ✅ GET all users (for task assignment)
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

module.exports = router;