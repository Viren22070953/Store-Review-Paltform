import { useEffect, useState } from "react";
import API from "../../api/axios";

const cardStyle = {
  display: "inline-block", padding: "20px 30px", margin: "10px",
  border: "1px solid #ddd", borderRadius: "8px", textAlign: "center",
  minWidth: "160px", background: "#f5f5f5",
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load dashboard."));
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {stats ? (
        <div>
          <div style={cardStyle}>
            <h1>{stats.totalUsers}</h1>
            <p>Total Users</p>
          </div>
          <div style={cardStyle}>
            <h1>{stats.totalStores}</h1>
            <p>Total Stores</p>
          </div>
          <div style={cardStyle}>
            <h1>{stats.totalRatings}</h1>
            <p>Total Ratings</p>
          </div>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminDashboard;
