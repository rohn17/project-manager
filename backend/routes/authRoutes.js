const express = require("express");
const router = express.Router();

// Import controller functions
const { signup, login } = require("../controllers/authController");

// ======================
// Auth Routes
// ======================

// Signup Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

module.exports = router;