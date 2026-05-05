const Task = require("../models/Task");

// ================= CREATE =================
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error("❌ Create error:", err.message);
    res.status(500).json({ message: "Task creation failed" });
  }
};

// ================= GET =================
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.json(tasks);
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// ================= UPDATE =================
exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "name")
      .populate("project", "name");

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("❌ Update error:", err.message);
    res.status(500).json({ message: "Task update failed" });
  }
};

// ================= DELETE =================
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ message: "Task deletion failed" });
  }
};