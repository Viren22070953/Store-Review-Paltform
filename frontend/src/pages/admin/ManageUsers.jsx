import { useEffect, useState } from "react";
import API from "../../api/axios";
import SortableTable from "../../components/common/SortableTable";
import AddUserForm from "../../components/admin/AddUserForm";

const inputStyle = { padding: "6px", marginRight: "8px", marginBottom: "8px" };

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    const params = {};
    if (filters.name) params.name = filters.name;
    if (filters.email) params.email = filters.email;
    if (filters.address) params.address = filters.address;
    if (filters.role) params.role = filters.role;
    const res = await API.get("/admin/users", { params });
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

 const handleDeleteUser = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;
  try {
    await API.delete(`/admin/users/${id}`);
    fetchUsers();
  } catch (err) {
    alert(err.response?.data?.message || "Error deleting user.");
  }
};

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "role", label: "Role" },
  {
    key: "actions", label: "Actions",
    render: (row) => (
      <div style={{ display: "flex", gap: "6px" }}>
        <button onClick={() => setSelectedUser(row)}
          style={{ padding: "3px 8px" }}>
          View
        </button>
        <button onClick={() => handleDeleteUser(row.id)}
          style={{ padding: "3px 8px", background: "#c0392b" }}>
          Delete
        </button>
      </div>
    ),
  },
];

  return (
    <div style={{ padding: "24px" }}>
      <h2>Manage Users</h2>

      {/* Filters */}
      <div>
        <input placeholder="Filter by Name" style={inputStyle} value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Filter by Email" style={inputStyle} value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Filter by Address" style={inputStyle} value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <select style={inputStyle} value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button onClick={fetchUsers} style={{ padding: "6px 14px" }}>Search</button>
        <button onClick={() => { setFilters({ name: "", email: "", address: "", role: "" }); fetchUsers(); }}
          style={{ marginLeft: "6px", padding: "6px 14px" }}>Clear</button>
      </div>

      {/* Add User Toggle */}
      <button onClick={() => setShowForm(!showForm)}
        style={{ margin: "12px 0", padding: "7px 16px" }}>
        {showForm ? "Hide Form" : "+ Add New User"}
      </button>

      {showForm && (
        <div style={{ border: "1px solid #ddd", padding: "16px", marginBottom: "16px", borderRadius: "6px", maxWidth: "420px" }}>
          <AddUserForm onSuccess={() => { setShowForm(false); fetchUsers(); }} />
        </div>
      )}

      <SortableTable columns={columns} data={users} />

      {/* User Detail Modal */}
      {selectedUser && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", minWidth: "300px" }}>
            <h3>User Details</h3>
            <p><b>Name:</b> {selectedUser.name}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Address:</b> {selectedUser.address}</p>
            <p><b>Role:</b> {selectedUser.role}</p>
            {selectedUser.role === "store_owner" && (
              <p><b>Store Avg Rating:</b> {selectedUser.avg_rating || "N/A"}</p>
            )}
            <button onClick={() => setSelectedUser(null)} style={{ padding: "6px 14px" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
