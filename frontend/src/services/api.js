import axios from "axios";

// ================= BASE URL =================
// 🔥 FORCE correct API URL (fixes 404 issue)
const API =
  process.env.REACT_APP_API_URL?.includes("/api")
    ? process.env.REACT_APP_API_URL
    : "https://project-manager-3bzs.onrender.com/api";

// ================= AXIOS INSTANCE =================
const api = axios.create({
  baseURL: API,
  timeout: 30000, // ⏱ increased for Render cold start
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔍 Debug (remove later if needed)
    console.log("➡️ API CALL:", `${config.baseURL}${config.url}`);

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("❌ API ERROR:", err.response?.data || err.message);

    // 🔐 Auto logout on token expiry
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }

    const message =
      err.response?.data?.message ||
      err.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
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