const Task = require("../models/Task");

// ================= CREATE =================
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET =================
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo")
      .populate("project");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE =================
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // update fields
    if (req.body.status) task.status = req.body.status;
    if (req.body.title) task.title = req.body.title;
    if (req.body.assignedTo) task.assignedTo = req.body.assignedTo;
    if (req.body.project) task.project = req.body.project;
    if (req.body.dueDate) task.dueDate = req.body.dueDate;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (err) {
    console.error("❌ Update error:", err.message);
    res.status(500).json({ message: "Update failed" });
  }
};

// ================= DELETE =================
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};