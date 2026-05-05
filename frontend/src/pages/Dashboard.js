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
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const [newProject, setNewProject] = useState("");
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role");

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [taskRes, projectRes, userRes] = await Promise.all([
        getTasks(),
        getProjects(),
        getUsers().catch(() => ({ data: [] })),
      ]);

      setTasks(taskRes.data);
      setProjects(projectRes.data);
      setUsers(userRes.data);
    } catch (err) {
      toast.error(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= CREATE TASK =================
  const handleCreate = async () => {
    if (!title.trim() || !projectId) {
      return toast.error("Title & Project required");
    }

    try {
      await createTask({
        title: title.trim(),
        project: projectId,
        assignedTo,
        dueDate,
      });

      toast.success("Task created 🎉");

      setTitle("");
      setProjectId("");
      setAssignedTo("");
      setDueDate("");

      fetchData();
    } catch (err) {
      toast.error(err.message || "Task creation failed");
    }
  };

  // ================= CREATE PROJECT =================
  const handleCreateProject = async () => {
    if (!newProject.trim()) return;

    try {
      await createProject({ name: newProject.trim() });
      toast.success("Project created");
      setNewProject("");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to create project");
    }
  };

  // ================= FILTER =================
  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (!projectFilter || t.project?._id === projectFilter)
  );

  // ================= LOADING UI =================
  if (loading) {
    return (
      <div className="container">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        projects={projects}
        setProjectFilter={setProjectFilter}
      />

      <div className="main-area">
        <Topbar search={search} setSearch={setSearch} />

        <div className="container">
          <h2>📊 Dashboard</h2>

          {/* ACTIVE FILTER */}
          {projectFilter && (
            <p style={{ marginBottom: "10px", color: "#38bdf8" }}>
              Filtering by selected project
            </p>
          )}

          {/* CREATE PROJECT */}
          {role === "admin" && (
            <div className="card">
              <h3>Create Project</h3>
              <input
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                placeholder="Project name"
              />
              <button onClick={handleCreateProject}>
                Add Project
              </button>
            </div>
          )}

          {/* CREATE TASK */}
          <div className="card">
            <h3>Create Task</h3>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />

            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Assign User</option>
              {users.length === 0 ? (
                <option>No users</option>
              ) : (
                users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))
              )}
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button onClick={handleCreate}>Add Task</button>
          </div>

          {/* KANBAN BOARD */}
          <div className="kanban-board">

            {/* TODO */}
            <div className="kanban-column">
              <h3>📝 Todo</h3>
              {filteredTasks.filter((t) => t.status === "todo").length === 0 && (
                <p style={{ color: "#94a3b8" }}>No tasks</p>
              )}
              {filteredTasks
                .filter((t) => t.status === "todo")
                .map((task) => (
                  <TaskCard key={task._id} task={task} onRefresh={fetchData} />
                ))}
            </div>

            {/* IN PROGRESS */}
            <div className="kanban-column">
              <h3>🚧 In Progress</h3>
              {filteredTasks.filter((t) => t.status === "in-progress").length === 0 && (
                <p style={{ color: "#94a3b8" }}>No tasks</p>
              )}
              {filteredTasks
                .filter((t) => t.status === "in-progress")
                .map((task) => (
                  <TaskCard key={task._id} task={task} onRefresh={fetchData} />
                ))}
            </div>

            {/* DONE */}
            <div className="kanban-column">
              <h3>✅ Done</h3>
              {filteredTasks.filter((t) => t.status === "done").length === 0 && (
                <p style={{ color: "#94a3b8" }}>No tasks</p>
              )}
              {filteredTasks
                .filter((t) => t.status === "done")
                .map((task) => (
                  <TaskCard key={task._id} task={task} onRefresh={fetchData} />
                ))}
            </div>

          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}