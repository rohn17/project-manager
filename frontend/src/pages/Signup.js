import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "member",
    adminKey: "", // ✅ NEW
  });

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SIGNUP =================
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("Please fill all fields");
    }

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    // ✅ Admin validation
    if (form.role === "admin" && !form.adminKey) {
      return alert("Admin key is required for admin signup");
    }

    try {
      setLoading(true);

      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        adminKey: form.adminKey, // ✅ send key
      });

      alert("Signup successful! Please login.");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
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
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
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

          {/* ✅ ADMIN KEY (ONLY IF ADMIN) */}
          {form.role === "admin" && (
            <input
              type="text"
              name="adminKey"
              placeholder="Enter admin secret key"
              value={form.adminKey}
              onChange={handleChange}
            />
          )}

          {/* PASSWORD */}
          <div className="input-group">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="toggle-password"
              onClick={() => setShow(!show)}
            >
              {show ? "🙈" : "👁"}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="input-group">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "🙈" : "👁"}
            </span>
          </div>

          {/* BUTTON */}
          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Signup"}
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