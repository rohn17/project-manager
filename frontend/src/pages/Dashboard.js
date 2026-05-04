import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  getProjects,
  createProject,
  getUsers,
} from "../services/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import TaskCard from "../components/TaskCard";
import Footer from "../components/Footer";

export default function Dashboard() {
  // ================= STATE =================
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

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [taskRes, projectRes, userRes] = await Promise.all([
        getTasks(),
        getProjects(),
        getUsers().catch(() => ({ data: [] })), // safe fallback
      ]);

      setTasks(taskRes.data);
      setProjects(projectRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= CREATE TASK =================
  const handleCreate = async () => {
    if (!title || !projectId) {
      return alert("Title and project required");
    }

    try {
      await createTask({
        title,
        project: projectId,
        assignedTo,
        dueDate,
      });

      setTitle("");
      setProjectId("");
      setAssignedTo("");
      setDueDate("");

      fetchData();
    } catch {
      alert("Failed to create task");
    }
  };

  // ================= CREATE PROJECT =================
  const handleCreateProject = async () => {
    if (!newProject) return;

    try {
      await createProject({ name: newProject });
      setNewProject("");
      fetchData();
    } catch {
      alert("Failed to create project");
    }
  };

  // ================= UPDATE =================
  const markDone = async (id) => {
    try {
      await updateTask(id, { status: "done" });
      fetchData();
    } catch {
      alert("Failed to update task");
    }
  };

  // ================= FILTER =================
  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (!projectFilter || t.project?._id === projectFilter)
  );

  // ================= STATS =================
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  // ================= UI =================
  return (
    <div className="app-layout">
      
      {/* SIDEBAR */}
      <Sidebar
        projects={projects}
        setProjectFilter={setProjectFilter}
      />

      {/* MAIN AREA */}
      <div className="main-area">

        {/* TOPBAR */}
        <Topbar search={search} setSearch={setSearch} />

        {/* CONTENT */}
        <div className="container">

          {/* HEADER */}
          <h2>📊 Dashboard</h2>

          {/* STATS */}
          <div className="card">
            <p>Total Tasks: {total}</p>
            <p style={{ color: "#22c55e" }}>
              Completed: {completed}
            </p>
            <p style={{ color: "#ef4444" }}>
              Overdue: {overdue}
            </p>
          </div>

          {/* ADMIN: CREATE PROJECT */}
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
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button onClick={handleCreate}>Add Task</button>
          </div>

          {/* FILTERS */}
          <div className="card">
            <input
              placeholder="🔍 Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* LOADING */}
          {loading && <p>Loading...</p>}

          {/* EMPTY STATE */}
          {!loading && filteredTasks.length === 0 && (
            <div className="card">No tasks found</div>
          )}

          {/* TASK GRID */}
          <div className="task-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDone={markDone}
              />
            ))}
          </div>

        </div>

        {/* FOOTER */}
        <Footer />

      </div>
    </div>
  );
}