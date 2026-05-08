import { useState } from "react";
import API from "../../api/axios";
import { validatePassword } from "../../utils/validators";

const wrap = { maxWidth: "380px", margin: "60px auto", padding: "24px", border: "1px solid #ddd", borderRadius: "8px" };
const inputStyle = { width: "100%", padding: "8px", marginBottom: "4px", boxSizing: "border-box" };
const errStyle = { color: "red", fontSize: "12px", marginBottom: "8px" };

const UpdatePassword = () => {
  const [form, setForm] = useState({ currentPassword: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = "Current password is required.";
    e.password = validatePassword(form.password);
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.values(e).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await API.put("/users/password", {
        currentPassword: form.currentPassword,
        password: form.password,
      });
      setMsg("Password updated successfully!");
      setForm({ currentPassword: "", password: "", confirm: "" });
    } catch (err) {
      setMsg(err.response?.data?.message || "Error updating password.");
    }
  };

  return (
    <div style={wrap}>
      <h2>Update Password</h2>
      {msg && <p style={{ color: msg.includes("success") ? "green" : "red" }}>{msg}</p>}
      <form onSubmit={handleSubmit}>
        <label>Current Password</label>
        <input style={inputStyle} type="password" value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
        {errors.currentPassword && <p style={errStyle}>{errors.currentPassword}</p>}

        <label>New Password</label>
        <input style={inputStyle} type="password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {errors.password && <p style={errStyle}>{errors.password}</p>}

        <label>Confirm New Password</label>
        <input style={inputStyle} type="password" value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        {errors.confirm && <p style={errStyle}>{errors.confirm}</p>}

        <button type="submit" style={{ width: "100%", padding: "9px", marginTop: "8px" }}>
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
