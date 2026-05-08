import { useEffect, useState } from "react";
import API from "../../api/axios";
import SortableTable from "../../components/common/SortableTable";
import StarRating from "../../components/common/StarRating";

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/owner/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard."));
  }, []);

  const columns = [
    { key: "name", label: "User Name" },
    { key: "email", label: "Email" },
    {
      key: "rating", label: "Rating",
      render: (row) => <StarRating value={row.rating} readonly />,
    },
    {
      key: "created_at", label: "Rated On",
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h2>Store Owner Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <>
          <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px", maxWidth: "360px", marginBottom: "24px" }}>
            <h3 style={{ margin: "0 0 8px" }}>{data.store.name}</h3>
            <p style={{ margin: "0 0 4px" }}>{data.store.address}</p>
            <p style={{ margin: "0 0 4px" }}>
              Average Rating: <strong>{data.store.avg_rating || "No ratings yet"}</strong>
            </p>
            {data.store.avg_rating > 0 && <StarRating value={Math.round(data.store.avg_rating)} readonly />}
            <p style={{ marginTop: "6px" }}>Total Ratings: <strong>{data.store.total_ratings}</strong></p>
          </div>

          <h3>Users Who Rated Your Store</h3>
          <SortableTable columns={columns} data={data.raters} />
        </>
      )}

      {!data && !error && <p>Loading...</p>}
    </div>
  );
};

export default OwnerDashboard;
