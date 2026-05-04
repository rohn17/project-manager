export default function TaskCard({ task, onDone }) {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date();

  const getStatusColor = () => {
    if (task.status === "done") return "#22c55e";
    if (task.status === "in-progress") return "#38bdf8";
    return "#facc15";
  };

  return (
    <div
      className="card"
      style={{
        border: isOverdue ? "2px solid #ef4444" : "1px solid #334155",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "180px",
      }}
    >
      {/* HEADER */}
      <div>
        <h3 style={{ marginBottom: "8px" }}>{task.title}</h3>

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

      {/* META INFO */}
      <div style={{ marginTop: "12px", fontSize: "14px", color: "#94a3b8" }}>
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
      <div style={{ marginTop: "12px" }}>
        {task.status !== "done" && (
          <button
            onClick={() => onDone(task._id)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              background: "#22c55e",
              color: "white",
              cursor: "pointer",
            }}
          >
            ✔ Mark Done
          </button>
        )}
      </div>
    </div>
  );
}