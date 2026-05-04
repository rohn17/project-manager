import axios from "axios";

// ================= BASE URL =================
const API = "https://project-manager-3bzs.onrender.com/api";

// ================= AXIOS INSTANCE =================
const api = axios.create({
  baseURL: API,
});

// ================= REQUEST INTERCEPTOR (AUTO TOKEN) =================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("❌ API ERROR:", err.response?.data || err.message);

    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }

    return Promise.reject(err);
  }
);

// ================= AUTH =================
export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);

// ================= USERS =================
export const getUsers = () => api.get("/users");

// ================= PROJECTS =================
export const getProjects = () => api.get("/projects");
export const createProject = (data) => api.post("/projects", data);

// ================= TASKS =================
export const getTasks = () => api.get("/tasks");
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);