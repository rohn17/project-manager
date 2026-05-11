import { useState } from "react";
import toast from "react-hot-toast";

import {
  updateTask,
  deleteTask,
} from "../services/api";

export default function TaskCard({
  task,
  onRefresh,
}) {

  // ================= STATES =================

  const [editing, setEditing] =
    useState(false);

  const [title, setTitle] =
    useState(task.title);

  const [loading, setLoading] =
    useState(false);

  // ================= OVERDUE =================

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  // ================= STATUS CLASS =================

  const getStatusClass = () => {

    switch (task.status) {

      case "done":
        return "status-done";

      case "in-progress":
        return "status-progress";

      default:
        return "status-todo";
    }
  };

  // ================= MOVE TASK =================

  const moveTask = async (
    status
  ) => {

    try {

      setLoading(true);

      await updateTask(
        task._id,
        { status }
      );

      toast.success(
        `Moved to ${status}`
      );

      onRefresh();

    } catch (err) {

      toast.error(
        err.message
      );

    } finally {

      setLoading(false);

    }
  };

  // ================= UPDATE TASK =================

  const handleUpdate =
    async () => {

      if (!title.trim()) {

        return toast.error(
          "Task title cannot be empty"
        );
      }

      try {

        setLoading(true);

        await updateTask(
          task._id,
          {
            title:
              title.trim(),
          }
        );

        toast.success(
          "Task updated ✨"
        );

        setEditing(false);

        onRefresh();

      } catch (err) {

        toast.error(
          err.message
        );

      } finally {

        setLoading(false);

      }
    };

  // ================= DELETE TASK =================

  const handleDelete =
    async () => {

      const confirmDelete =
        window.confirm(
          "Delete this task?"
        );

      if (!confirmDelete)
        return;

      try {

        setLoading(true);

        await deleteTask(
          task._id
        );

        toast.success(
          "Task deleted 🗑"
        );

        onRefresh();

      } catch (err) {

        toast.error(
          err.message
        );

      } finally {

        setLoading(false);

      }
    };

  // ================= UI =================

  return (

    <div
      className={`card task-card ${
        isOverdue
          ? "overdue-card"
          : ""
      }`}
      style={{
        opacity: loading
          ? 0.7
          : 1,
      }}
    >

      {/* OVERDUE DOT */}
      {isOverdue && (
        <div className="overdue-dot"></div>
      )}

      {/* HEADER */}
      <div className="task-header">

        {editing ? (

          <input
            value={title}
            autoFocus
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

        ) : (

          <h3 className="task-title">
            {task.title}
          </h3>

        )}

        {/* STATUS */}
        <span
          className={`task-status ${getStatusClass()}`}
        >
          {task.status}
        </span>

      </div>

      {/* META */}
      <div className="task-meta">

        {/* PROJECT */}
        {task.project && (

          <div className="task-meta-item">

            <span>📁</span>

            <span>
              {task.project.name}
            </span>

          </div>

        )}

        {/* USER */}
        {task.assignedTo && (

          <div className="task-meta-item">

            <span>👤</span>

            <span>
              {
                task.assignedTo
                  .name
              }
            </span>

          </div>

        )}

        {/* DATE */}
        {task.dueDate && (

          <div
            className={`task-meta-item ${
              isOverdue
                ? "overdue-text"
                : ""
            }`}
          >

            <span>⏰</span>

            <span>

              {new Date(
                task.dueDate
              ).toLocaleDateString()}

              {isOverdue &&
                " • Overdue"}

            </span>

          </div>

        )}

      </div>

      {/* ACTIONS */}
      <div className="task-actions">

        {/* TODO */}
        {task.status !==
          "todo" && (

          <button
            disabled={loading}
            onClick={() =>
              moveTask(
                "todo"
              )
            }
            title="Move to Todo"
          >
            ⬅
          </button>

        )}

        {/* PROGRESS */}
        {task.status !==
          "in-progress" && (

          <button
            disabled={loading}
            onClick={() =>
              moveTask(
                "in-progress"
              )
            }
            title="Move to Progress"
          >
            🚧
          </button>

        )}

        {/* DONE */}
        {task.status !==
          "done" && (

          <button
            disabled={loading}
            onClick={() =>
              moveTask(
                "done"
              )
            }
            title="Mark Done"
          >
            ✔
          </button>

        )}

        {/* EDIT / SAVE */}
        {editing ? (

          <button
            className="save-btn"
            disabled={loading}
            onClick={
              handleUpdate
            }
          >
            💾
          </button>

        ) : (

          <button
            className="edit-btn"
            disabled={loading}
            onClick={() =>
              setEditing(true)
            }
          >
            ✏
          </button>

        )}

        {/* DELETE */}
        <button
          className="delete-btn"
          disabled={loading}
          onClick={
            handleDelete
          }
        >
          🗑
        </button>

      </div>

    </div>
  );
}