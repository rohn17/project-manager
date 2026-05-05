import { useState } from "react";
import toast from "react-hot-toast";
import { updateTask, deleteTask } from "../services/api";

export default function TaskCard({ task, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date();

  const getStatusColor = () => {
    if (task.status === "done") return "#22c55e";
    if (task.status === "in-progress") return "#38bdf8";
    return "#facc15";
  };

  // ================= MOVE TASK =================
  const moveTask = async (status) => {
    try {
      setLoading(true);
      await updateTask(task._id, { status });
      toast.success(`Moved to ${status}`);
      onRefresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!title.trim()) {
      return toast.error("Title cannot be empty");
    }

    try {
      setLoading(true);
      await updateTask(task._id, { title: title.trim() });
      toast.success("Task updated ✏️");
      setEditing(false);
      onRefresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;

    try {
      setLoading(true);
      await deleteTask(task._id);
      toast.success("Task deleted 🗑");
      onRefresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        border: isOverdue ? "2px solid #ef4444" : "1px solid #334155",
        minHeight: "180px",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {/* HEADER */}
      <div>
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        ) : (
          <h3 style={{ marginBottom: "8px" }}>{task.title}</h3>
        )}

        {/* STATUS BADGE */}
        <span
          style={{
            background: getStatusColor(),
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            color: task.status === "todo" ? "#000" : "#fff",
          }}
        >
          {task.status}
        </span>
      </div>

      {/* META */}
      <div style={{ marginTop: "10px", fontSize: "14px", color: "#94a3b8" }}>
        {task.project && <p>📁 {task.project.name}</p>}
        {task.assignedTo && <p>👤 {task.assignedTo.name}</p>}

        {task.dueDate && (
          <p style={{ color: isOverdue ? "#ef4444" : "" }}>
            ⏰ {new Date(task.dueDate).toLocaleDateString()}
            {isOverdue && " (Overdue)"}
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="task-actions">
        {/* MOVE BUTTONS */}
        {task.status !== "todo" && (
          <button disabled={loading} onClick={() => moveTask("todo")}>
            ⬅
          </button>
        )}

        {task.status !== "in-progress" && (
          <button
            disabled={loading}
            onClick={() => moveTask("in-progress")}
          >
            ➡
          </button>
        )}

        {task.status !== "done" && (
          <button disabled={loading} onClick={() => moveTask("done")}>
            ✔
          </button>
        )}

        {/* EDIT / SAVE */}
        {editing ? (
          <button
            className="save-btn"
            disabled={loading}
            onClick={handleUpdate}
          >
            💾
          </button>
        ) : (
          <button
            className="edit-btn"
            disabled={loading}
            onClick={() => setEditing(true)}
          >
            ✏
          </button>
        )}

        {/* DELETE */}
        <button
          className="delete-btn"
          disabled={loading}
          onClick={handleDelete}
        >
          🗑
        </button>
      </div>
    </div>
  );
}