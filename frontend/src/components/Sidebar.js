import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({
  projects,
  setProjectFilter,
}) {

  const navigate =
    useNavigate();

  const [active, setActive] =
    useState("");

  // USER
  const user =
    localStorage.getItem("name") ||
    "User";

  const role =
    localStorage.getItem("role") ||
    "Member";

  // ================= FILTER =================

  const handleFilter = (id) => {

    setActive(id);

    setProjectFilter(id);
  };

  // ================= LOGOUT =================

  const logout = () => {

    localStorage.clear();

    navigate("/");
  };

  // ================= UI =================

  return (

    <div className="sidebar">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="logo">

          <div className="logo-icon">
            🚀
          </div>

          <div>

            <h2>
              PM Tool
            </h2>

            <p>
              Productivity Workspace
            </p>

          </div>

        </div>

        {/* USER CARD */}
        <div className="user-card">

          {/* AVATAR */}
          <div className="user-avatar">

            {user.charAt(0)}

          </div>

          {/* INFO */}
          <div className="user-info">

            <h4>
              {user}
            </h4>

            <p>
              {role}
            </p>

          </div>

        </div>

        {/* ALL TASKS */}
        <div
          onClick={() =>
            handleFilter("")
          }
          className={`menu-item ${
            active === ""
              ? "active"
              : ""
          }`}
        >

          📋 All Tasks

        </div>

        {/* PROJECT SECTION */}
        <div className="project-section">

          {/* HEADER */}
          <div className="project-header">

            <h4>
              PROJECTS
            </h4>

            <span className="project-count">

              {projects.length}

            </span>

          </div>

          {/* PROJECT LIST */}
          {projects.length === 0 ? (

            <p className="empty-text">
              No projects available
            </p>

          ) : (

            projects.map((project) => (

              <div
                key={project._id}
                onClick={() =>
                  handleFilter(
                    project._id
                  )
                }
                className={`menu-item ${
                  active ===
                  project._id
                    ? "active"
                    : ""
                }`}
              >

                📁 {project.name}

              </div>

            ))

          )}

        </div>

      </div>

      {/* BOTTOM */}
      <div>

        {/* BOOST CARD */}
        <div className="boost-card">

          <h3>
            🚀 Productivity Boost
          </h3>

          <p>
            Manage projects and
            tasks efficiently with
            your modern workspace.
          </p>

        </div>

        {/* LOGOUT */}
        <button
          className="logout-btn"
          onClick={logout}
        >

          Logout

        </button>

      </div>

    </div>
  );
}