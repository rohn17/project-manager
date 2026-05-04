const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,   // ✅ ADD
  deleteTask,   // ✅ ADD
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

// CREATE
router.post("/", protect, createTask);

// GET
router.get("/", protect, getTasks);

// ✅ UPDATE (VERY IMPORTANT)
router.put("/:id", protect, updateTask);

// ✅ DELETE (optional but useful)
router.delete("/:id", protect, deleteTask);

module.exports = router;