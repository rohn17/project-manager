import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getTasks,
  createTask,
  getProjects,
  createProject,
  getUsers,
} from "../services/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import TaskCard from "../components/TaskCard";
import Footer from "../components/Footer";

export default function Dashboard() {

  // ================= STATES =================

  const [tasks, setTasks] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  // TASK FORM
  const [title, setTitle] =
    useState("");

  const [projectId, setProjectId] =
    useState("");

  const [assignedTo, setAssignedTo] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  // FILTERS
  const [search, setSearch] =
    useState("");

  const [projectFilter,
    setProjectFilter] =
    useState("");

  // PROJECT FORM
  const [newProject,
    setNewProject] =
    useState("");

  // LOADING
  const [loading, setLoading] =
    useState(false);

  // ROLE
  const role =
    localStorage.getItem("role");

  // ================= FETCH DATA =================

  const fetchData = async () => {

    try {

      setLoading(true);

      const [
        taskRes,
        projectRes,
        userRes,
      ] = await Promise.all([
        getTasks(),
        getProjects(),
        getUsers().catch(() => ({
          data: [],
        })),
      ]);

      setTasks(taskRes.data);

      setProjects(projectRes.data);

      setUsers(userRes.data);

    } catch (err) {

      toast.error(
        err.message ||
        "Failed to load dashboard"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= CREATE TASK =================

  const handleCreateTask =
    async () => {

      if (
        !title.trim() ||
        !projectId
      ) {

        return toast.error(
          "Task title & project required"
        );
      }

      try {

        await createTask({

          title:
            title.trim(),

          project:
            projectId,

          assignedTo,

          dueDate,
        });

        toast.success(
          "Task created 🚀"
        );

        // RESET
        setTitle("");
        setProjectId("");
        setAssignedTo("");
        setDueDate("");

        fetchData();

      } catch (err) {

        toast.error(
          err.message ||
          "Task creation failed"
        );

      }
    };

  // ================= CREATE PROJECT =================

  const handleCreateProject =
    async () => {

      if (!newProject.trim()) {

        return toast.error(
          "Enter project name"
        );
      }

      try {

        await createProject({
          name:
            newProject.trim(),
        });

        toast.success(
          "Project created 🎉"
        );

        setNewProject("");

        fetchData();

      } catch (err) {

        toast.error(
          err.message ||
          "Project creation failed"
        );

      }
    };

  // ================= FILTER TASKS =================

  const filteredTasks =
    tasks.filter((task) => {

      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesProject =
        !projectFilter ||
        task.project?._id ===
        projectFilter;

      return (
        matchesSearch &&
        matchesProject
      );
    });

  // ================= TASK GROUPS =================

  const todoTasks =
    filteredTasks.filter(
      (task) =>
        task.status === "todo"
    );

  const progressTasks =
    filteredTasks.filter(
      (task) =>
        task.status ===
        "in-progress"
    );

  const doneTasks =
    filteredTasks.filter(
      (task) =>
        task.status === "done"
    );

  // ================= LOADING =================

  if (loading) {

    return (

      <div className="loading-screen">

        <div className="loader"></div>

        <h2>
          Loading Dashboard...
        </h2>

      </div>

    );
  }

  // ================= UI =================

  return (

    <div className="app-layout">

      {/* SIDEBAR */}
      <Sidebar
        projects={projects}
        setProjectFilter={
          setProjectFilter
        }
      />

      {/* MAIN */}
      <div className="main-area">

        {/* TOPBAR */}
        <Topbar
          search={search}
          setSearch={setSearch}
        />

        {/* CONTAINER */}
        <div className="container">

          {/* TITLE */}
          <div className="dashboard-title">

            <h1>
              🚀 Project Dashboard
            </h1>

            <p>
              Manage projects,
              tasks and workflow
              with your modern
              productivity workspace.
            </p>

          </div>

          {/* STATS */}
          <div className="stats-grid">

            <div className="stats-card">

              <h3>
                📋 Total Tasks
              </h3>

              <h2>
                {filteredTasks.length}
              </h2>

            </div>

            <div className="stats-card todo-card">

              <h3>
                📝 Todo
              </h3>

              <h2>
                {todoTasks.length}
              </h2>

            </div>

            <div className="stats-card progress-card">

              <h3>
                🚧 In Progress
              </h3>

              <h2>
                {progressTasks.length}
              </h2>

            </div>

            <div className="stats-card done-card">

              <h3>
                ✅ Done
              </h3>

              <h2>
                {doneTasks.length}
              </h2>

            </div>

          </div>

          {/* GRID */}
          <div className="dashboard-grid">

            {/* LEFT */}
            <div className="dashboard-left">

              {/* CREATE PROJECT */}
              {role === "admin" && (

                <div className="card">

                  <h2>
                    📁 Create Project
                  </h2>

                  <input
                    type="text"
                    placeholder="Project name"
                    value={newProject}
                    onChange={(e) =>
                      setNewProject(
                        e.target.value
                      )
                    }
                  />

                  <button
                    className="full-btn"
                    onClick={
                      handleCreateProject
                    }
                  >
                    Create Project
                  </button>

                </div>

              )}

              {/* CREATE TASK */}
              <div className="card">

                <h2>
                  ✅ Create Task
                </h2>

                <input
                  type="text"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                />

                <select
                  value={projectId}
                  onChange={(e) =>
                    setProjectId(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Project
                  </option>

                  {projects.map(
                    (project) => (

                      <option
                        key={
                          project._id
                        }
                        value={
                          project._id
                        }
                      >
                        {project.name}
                      </option>

                    )
                  )}

                </select>

                <select
                  value={assignedTo}
                  onChange={(e) =>
                    setAssignedTo(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Assign User
                  </option>

                  {users.map(
                    (user) => (

                      <option
                        key={user._id}
                        value={user._id}
                      >
                        {user.name}
                      </option>

                    )
                  )}

                </select>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(
                      e.target.value
                    )
                  }
                />

                <button
                  className="full-btn"
                  onClick={
                    handleCreateTask
                  }
                >
                  Add Task
                </button>

              </div>

            </div>

            {/* RIGHT */}
            <div className="dashboard-right">

              {/* FILTER */}
              {projectFilter && (

                <div className="card filter-card">

                  🔎 Showing tasks
                  for selected project

                </div>

              )}

              {/* BOARD */}
              <div className="kanban-board">

                {/* TODO */}
                <div className="kanban-column">

                  <h3>
                    📝 Todo
                  </h3>

                  {todoTasks.length > 0 ? (

                    todoTasks.map(
                      (task) => (

                        <TaskCard
                          key={
                            task._id
                          }
                          task={task}
                          onRefresh={
                            fetchData
                          }
                        />

                      )
                    )

                  ) : (

                    <p className="empty-text">
                      No tasks available
                    </p>

                  )}

                </div>

                {/* PROGRESS */}
                <div className="kanban-column">

                  <h3>
                    🚧 In Progress
                  </h3>

                  {progressTasks.length > 0 ? (

                    progressTasks.map(
                      (task) => (

                        <TaskCard
                          key={
                            task._id
                          }
                          task={task}
                          onRefresh={
                            fetchData
                          }
                        />

                      )
                    )

                  ) : (

                    <p className="empty-text">
                      No tasks available
                    </p>

                  )}

                </div>

                {/* DONE */}
                <div className="kanban-column">

                  <h3>
                    ✅ Done
                  </h3>

                  {doneTasks.length > 0 ? (

                    doneTasks.map(
                      (task) => (

                        <TaskCard
                          key={
                            task._id
                          }
                          task={task}
                          onRefresh={
                            fetchData
                          }
                        />

                      )
                    )

                  ) : (

                    <p className="empty-text">
                      No tasks available
                    </p>

                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <Footer />

      </div>

    </div>
  );
}