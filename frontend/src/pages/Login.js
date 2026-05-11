import { useState } from "react";
import { login } from "../services/api";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

export default function Login() {

  // ================= STATE =================

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const [show, setShow] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= LOGIN =================

  const handleLogin =
    async (e) => {

      e.preventDefault();

      // PREVENT MULTIPLE CLICKS
      if (loading) return;

      // VALIDATION
      if (
        !form.email.trim() ||
        !form.password.trim()
      ) {

        return toast.error(
          "Please fill all fields"
        );
      }

      try {

        setLoading(true);

        // API CALL
        const res =
          await login({
            email:
              form.email.trim(),

            password:
              form.password.trim(),
          });

        // STORE DATA
        localStorage.setItem(
          "token",
          res.data.token
        );

        localStorage.setItem(
          "role",
          res.data.user.role
        );

        localStorage.setItem(
          "name",
          res.data.user.name
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            res.data.user
          )
        );

        // SUCCESS
        toast.success(
          "Login successful 🎉"
        );

        // REDIRECT
        navigate("/dashboard");

      } catch (err) {

        toast.error(
          err.message ||
          "Invalid credentials"
        );

      } finally {

        setLoading(false);

      }
    };

  // ================= UI =================

  return (

    <div className="auth-wrapper">

      {/* GLOW */}
      <div className="auth-glow"></div>

      {/* CARD */}
      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">

          <h1 className="auth-title">
            🚀 Welcome Back
          </h1>

          <p className="auth-subtitle">
            Login to continue managing
            your projects and tasks
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="auth-form"
        >

          {/* EMAIL */}
          <div className="input-wrapper">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />

          </div>

          {/* PASSWORD */}
          <div className="input-wrapper">

            <label htmlFor="password">
              Password
            </label>

            <div className="input-group">

              <input
                id="password"
                type={
                  show
                    ? "text"
                    : "password"
                }
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />

              <span
                className="toggle-password"
                onClick={() =>
                  setShow(!show)
                }
              >
                {show
                  ? "🙈"
                  : "👁"}
              </span>

            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

        {/* FOOTER */}
        <div className="auth-footer">

          <p className="auth-link">

            Don’t have an account?{" "}

            <Link to="/signup">
              Create one
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}