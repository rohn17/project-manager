// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ======================
// Middleware
// ======================

// CORS (secure for production)
app.use(
  cors({
    origin: "*", // change to your frontend URL in production
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// ======================
// Routes Import
// ======================
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes"); // 👈 NEW

// ======================
// Routes
// ======================

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 API is running...",
    status: "OK",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes); // 👈 REQUIRED for assignment

// ======================
// 404 Handler
// ======================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ======================
// Global Error Handler
// ======================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

// ======================
// Database Connection
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1); // stop app if DB fails
  });

// ======================
// Server Start
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});