import { useState } from "react";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await login(form);

      // ✅ STORE DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ REDIRECT
      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="auth-wrapper">

      {/* GLOW BACKGROUND */}
      <div className="auth-glow"></div>

      <div className="auth-card">

        {/* HEADER */}
        <h2 className="auth-title">🚀 Welcome Back</h2>
        <p className="auth-subtitle">
          Login to continue managing your projects
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="auth-form">

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <div className="input-group">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
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

          {/* BUTTON */}
          <button className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="auth-link">
          Don’t have an account?{" "}
          <Link to="/signup">Create one</Link>
        </p>

      </div>
    </div>
  );
}