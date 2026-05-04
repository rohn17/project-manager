import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px",
      background: "#020617"
    }}>
      <h3>🚀 Project Manager</h3>
      <button onClick={logout}>Logout</button>
    </div>
  );
}