import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🏬 StoreScope
      </Link>

      <div className="navbar-links">
        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/stores">Stores</Link>
          </>
        )}

        {user?.role === "user" && (
          <>
            <Link to="/stores">Stores</Link>
            <Link to="/update-password">Password</Link>
          </>
        )}

        {user?.role === "store_owner" && (
          <>
            <Link to="/owner/dashboard">Dashboard</Link>
            <Link to="/update-password">Password</Link>
          </>
        )}

        {user && (
          <button onClick={handleLogout} className="navbar-logout">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
