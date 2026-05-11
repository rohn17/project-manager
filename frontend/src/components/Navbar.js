import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate =
    useNavigate();

  // ================= USER =================

  const user =
    localStorage.getItem("name") ||
    "User";

  const role =
    localStorage.getItem("role") ||
    "Member";

  // ================= LOGOUT =================

  const logout = () => {

    localStorage.clear();

    navigate("/");
  };

  // ================= UI =================

  return (

    <div className="topbar">

      {/* LEFT */}
      <div className="topbar-left">

        <div className="topbar-logo">
          🚀
        </div>

        <div className="topbar-heading">

          <h2>
            Dashboard
          </h2>

          <p>
            Project Management Workspace
          </p>

        </div>

      </div>

      {/* CENTER */}
      <div className="topbar-center">

        <input
          type="text"
          placeholder="🔍 Search tasks..."
          className="topbar-search"
        />

      </div>

      {/* RIGHT */}
      <div className="topbar-right">

        {/* USER */}
        <div className="topbar-user">

          <div className="topbar-avatar">

            {user.charAt(0)}

          </div>

          <div className="topbar-user-info">

            <h4>
              {user}
            </h4>

            <p>
              {role}
            </p>

          </div>

        </div>

        {/* LOGOUT */}
        <button
          className="topbar-logout"
          onClick={logout}
        >

          Logout

        </button>

      </div>

    </div>
  );
}