import { useEffect, useState } from "react";
import API from "../../api/axios";
import SortableTable from "../../components/common/SortableTable";
import AddStoreForm from "../../components/admin/AddStoreForm";

const inputStyle = { padding: "6px", marginRight: "8px", marginBottom: "8px" };

const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [showForm, setShowForm] = useState(false);

  const fetchStores = async () => {
    const params = {};
    if (filters.name) params.name = filters.name;
    if (filters.email) params.email = filters.email;
    if (filters.address) params.address = filters.address;
    const res = await API.get("/admin/stores", { params });
    setStores(res.data);
  };

  useEffect(() => { fetchStores(); }, []);

  const handleDeleteStore = async (id) => {
  if (!window.confirm("Are you sure you want to delete this store?")) return;
  try {
    await API.delete(`/admin/stores/${id}`);
    fetchStores();
  } catch (err) {
    alert(err.response?.data?.message || "Error deleting store.");
  }
};

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "owner_name", label: "Owner" },
  { key: "avg_rating", label: "Avg Rating", render: (row) => row.avg_rating || "N/A" },
  { key: "total_ratings", label: "Total Ratings" },
  {
    key: "actions", label: "Actions",
    render: (row) => (
      <button onClick={() => handleDeleteStore(row.id)}
        style={{ padding: "3px 8px", background: "#c0392b", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        Delete
      </button>
    ),
  },
];

  return (
    <div style={{ padding: "24px" }}>
      <h2>Manage Stores</h2>

      {/* Filters */}
      <div>
        <input placeholder="Filter by Name" style={inputStyle} value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Filter by Email" style={inputStyle} value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Filter by Address" style={inputStyle} value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <button onClick={fetchStores} style={{ padding: "6px 14px" }}>Search</button>
        <button onClick={() => { setFilters({ name: "", email: "", address: "" }); fetchStores(); }}
          style={{ marginLeft: "6px", padding: "6px 14px" }}>Clear</button>
      </div>

      {/* Add Store Toggle */}
      <button onClick={() => setShowForm(!showForm)}
        style={{ margin: "12px 0", padding: "7px 16px" }}>
        {showForm ? "Hide Form" : "+ Add New Store"}
      </button>

      {showForm && (
        <div style={{ border: "1px solid #ddd", padding: "16px", marginBottom: "16px", borderRadius: "6px", maxWidth: "420px" }}>
          <AddStoreForm onSuccess={() => { setShowForm(false); fetchStores(); }} />
        </div>
      )}

      <SortableTable columns={columns} data={stores} />
    </div>
  );
};

export default ManageStores;
