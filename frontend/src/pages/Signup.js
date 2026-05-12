import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {

  // ================= STATES =================
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "member",
    adminKey: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    console.log("INPUT:", e.target.name, e.target.value);

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= HANDLE SIGNUP =================
  const handleSignup = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    // ================= VALIDATION =================
    if (!name || !email || !form.password || !form.confirmPassword) {
      return alert("Please fill all fields");
    }

    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    // ================= ADMIN VALIDATION =================
    if (form.role === "admin" && !form.adminKey) {
      return alert("Admin secret key is required");
    }

    try {

      setLoading(true);

      // ================= DEBUG =================
      console.log("FORM DATA:", form);

      // ================= API CALL =================
      const response = await signup({
        name,
        email,
        password: form.password,
        role: form.role,
        adminKey: form.adminKey,
      });

      alert(response?.data?.message || "Signup successful!");

      // ================= RESET FORM =================
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "member",
        adminKey: "",
      });

      // ================= REDIRECT =================
      navigate("/");

    } catch (err) {

      console.error("Signup Error:", err);

      alert(
        err.response?.data?.message ||
        "Signup failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">

      <div className="auth-glow"></div>

      <div className="auth-card">

        {/* HEADER */}
        <h2 className="auth-title">✨ Create Account</h2>

        <p className="auth-subtitle">
          Start managing your projects efficiently
        </p>

        {/* FORM */}
        <form onSubmit={handleSignup} className="auth-form">

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            autoComplete="off"
          />

          {/* ROLE */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="role-select"
          >
            <option value="member">👤 Member</option>
            <option value="admin">👑 Admin</option>
          </select>

          {/* ADMIN KEY */}
          {form.role === "admin" && (
            <input
              type="password"
              name="adminKey"
              placeholder="Enter admin secret key"
              value={form.adminKey}
              onChange={handleChange}
              autoComplete="off"
            />
          )}

          {/* PASSWORD */}
          <div className="input-group">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="input-group">

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <span
              className="toggle-password"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "🙈" : "👁"}
            </span>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Signup"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>

      </div>
    </div>
  );
}