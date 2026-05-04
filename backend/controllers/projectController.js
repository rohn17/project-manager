const Project = require("../models/Project");

// Create Project (Admin only)
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Get Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("members");
    res.json(projects);
  } catch (err) {
    res.status(500).json(err.message);
  }
};