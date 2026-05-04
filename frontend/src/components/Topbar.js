import { useNavigate } from "react-router-dom";

export default function Topbar({ search = "", setSearch = () => {} }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="topbar">
      
      {/* LEFT */}
      <h3 className="topbar-title">🚀 Dashboard</h3>

      {/* CENTER SEARCH */}
      <div className="topbar-search">
        <input
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* RIGHT */}
      <div className="topbar-right">
        
        <span className="notification">🔔</span>

        <div className="user-info">
          <p>{user?.name || "User"}</p>
          <span className={role === "admin" ? "role-admin" : "role-member"}>
            {role}
          </span>
        </div>

        <div className="avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}