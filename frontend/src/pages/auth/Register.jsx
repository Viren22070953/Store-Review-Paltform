import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { validateName, validateEmail, validatePassword, validateAddress } from "../../utils/validators";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const e = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      address: validateAddress(form.address),
    };
    setErrors(e);
    return Object.values(e).every((v) => v === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await API.post("/auth/register", form);
      setMsg("Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-stars"></div>

      <div className="register-card">
        <div className="register-badge">★ Store Rating Platform</div>

        <h2>
          Create <span>Account</span>
        </h2>

        <p className="register-subtitle">
          Join StoreRating and start sharing your store experiences.
        </p>

        {msg && (
          <p className={msg.includes("success") ? "register-success" : "register-error"}>
            {msg}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}

          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}

          <label>Address</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          {errors.address && <p className="field-error">{errors.address}</p>}

          <button type="submit">Register</button>
        </form>

        <p className="register-login">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
