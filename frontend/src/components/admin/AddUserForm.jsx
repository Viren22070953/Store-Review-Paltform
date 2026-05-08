import { useState } from "react";
import API from "../../api/axios";
import { validateName, validateEmail, validatePassword, validateAddress } from "../../utils/validators";

const inputStyle = { width: "100%", padding: "7px", marginBottom: "4px", boxSizing: "border-box" };
const errStyle = { color: "red", fontSize: "12px", marginBottom: "8px" };

const AddUserForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", role: "user" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  const validate = () => {
    const e = {};
    e.name = validateName(form.name);
    e.email = validateEmail(form.email);
    e.password = validatePassword(form.password);
    e.address = validateAddress(form.address);
    setErrors(e);
    return Object.values(e).every((v) => v === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await API.post("/admin/users", form);
      setMsg("User added successfully!");
      setForm({ name: "", email: "", password: "", address: "", role: "user" });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error adding user.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New User</h3>
      {msg && <p style={{ color: msg.includes("success") ? "green" : "red" }}>{msg}</p>}

      <input placeholder="Full Name (20-60 chars)" style={inputStyle}
        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      {errors.name && <p style={errStyle}>{errors.name}</p>}

      <input placeholder="Email" style={inputStyle}
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      {errors.email && <p style={errStyle}>{errors.email}</p>}

      <input placeholder="Password" type="password" style={inputStyle}
        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {errors.password && <p style={errStyle}>{errors.password}</p>}

      <input placeholder="Address (max 400 chars)" style={inputStyle}
        value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      {errors.address && <p style={errStyle}>{errors.address}</p>}

      <select style={inputStyle} value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="user">Normal User</option>
        <option value="admin">Admin</option>
        <option value="store_owner">Store Owner</option>
      </select>

      <button type="submit" style={{ padding: "8px 16px", marginTop: "6px" }}>Add User</button>
    </form>
  );
};

export default AddUserForm;
