const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

router.post("/", protect, isAdmin, createProject);
router.get("/", protect, getProjects);

module.exports = router;