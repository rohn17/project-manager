import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ projects, setProjectFilter }) {
  const navigate = useNavigate();
  const [active, setActive] = useState("");

  const handleFilter = (id) => {
    setActive(id);
    setProjectFilter(id);
  };

  return (
    <div className="sidebar">
      {/* HEADER */}
      <h2 className="logo">🚀 PM Tool</h2>

      {/* ALL TASKS */}
      <div
        className={`menu-item ${active === "" ? "active" : ""}`}
        onClick={() => handleFilter("")}
      >
        📋 All Tasks
      </div>

      {/* PROJECTS */}
      <div className="project-section">
        <h4>Projects</h4>

        {projects.map((p) => (
          <div
            key={p._id}
            onClick={() => handleFilter(p._id)}
            className={`menu-item ${
              active === p._id ? "active" : ""
            }`}
          >
            📁 {p.name}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}