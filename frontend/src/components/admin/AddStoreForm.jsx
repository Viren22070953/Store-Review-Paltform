import { useState } from "react";
import API from "../../api/axios";
import { validateName, validateEmail, validateAddress } from "../../utils/validators";

const inputStyle = { width: "100%", padding: "7px", marginBottom: "4px", boxSizing: "border-box" };
const errStyle = { color: "red", fontSize: "12px", marginBottom: "8px" };

const AddStoreForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: "", email: "", address: "", owner_id: "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  const validate = () => {
    const e = {};
    e.name = validateName(form.name);
    e.email = validateEmail(form.email);
    e.address = validateAddress(form.address);
    setErrors(e);
    return Object.values(e).every((v) => v === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = { ...form, owner_id: form.owner_id ? Number(form.owner_id) : null };
      await API.post("/admin/stores", payload);
      setMsg("Store added successfully!");
      setForm({ name: "", email: "", address: "", owner_id: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error adding store.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Store</h3>
      {msg && <p style={{ color: msg.includes("success") ? "green" : "red" }}>{msg}</p>}

      <input placeholder="Store Name (max 20 chars)" style={inputStyle}
        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      {errors.name && <p style={errStyle}>{errors.name}</p>}

      <input placeholder="Store Email" style={inputStyle}
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      {errors.email && <p style={errStyle}>{errors.email}</p>}

      <input placeholder="Address (max 400 chars)" style={inputStyle}
        value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      {errors.address && <p style={errStyle}>{errors.address}</p>}

      <input placeholder="Owner ID (optional)" style={inputStyle} type="number"
        value={form.owner_id} onChange={(e) => setForm({ ...form, owner_id: e.target.value })} />

      <button type="submit" style={{ padding: "8px 16px", marginTop: "6px" }}>
        Add Store
      </button>
    </form>
  );
};

export default AddStoreForm;