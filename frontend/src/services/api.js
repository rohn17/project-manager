import axios from "axios";

// ================= BASE URL =================
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://project-manager-3bzs.onrender.com/api";

// ================= AXIOS INSTANCE =================
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {

    // Get token
    const token = localStorage.getItem("token");

    // Add token if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ================= DEBUG =================
    console.log("➡️ API URL:", `${config.baseURL}${config.url}`);
    console.log("➡️ REQUEST DATA:", config.data);

    return config;

  },
  (error) => {
    console.error("❌ REQUEST ERROR:", error);

    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(

  // Success
  (response) => {

    console.log("✅ API RESPONSE:", response.data);

    return response;
  },

  // Error
  (error) => {

    console.error(
      "❌ API ERROR:",
      error.response?.data || error.message
    );

    // Auto logout if token invalid
    if (error.response?.status === 401) {

      localStorage.removeItem("token");

      // Redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

// ================= AUTH =================

// SIGNUP
export const signup = async (data) => {

  console.log("🔥 SIGNUP PAYLOAD:", data);

  return await api.post(
    "/auth/signup",
    {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      adminKey: data.adminKey,
    }
  );
};

// LOGIN
export const login = async (data) => {

  return await api.post(
    "/auth/login",
    data
  );
};

// ================= USERS =================
export const getUsers = async () => {
  return await api.get("/users");
};

// ================= PROJECTS =================

// GET PROJECTS
export const getProjects = async () => {
  return await api.get("/projects");
};

// CREATE PROJECT
export const createProject = async (data) => {
  return await api.post(
    "/projects",
    data
  );
};

// ================= TASKS =================

// GET TASKS
export const getTasks = async () => {
  return await api.get("/tasks");
};

// CREATE TASK
export const createTask = async (data) => {
  return await api.post(
    "/tasks",
    data
  );
};

// UPDATE TASK
export const updateTask = async (id, data) => {
  return await api.put(
    `/tasks/${id}`,
    data
  );
};

// DELETE TASK
export const deleteTask = async (id) => {
  return await api.delete(
    `/tasks/${id}`
  );
};

export default api;