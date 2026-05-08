// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import API from "../../api/axios";
// import { useAuth } from "../../context/AuthContext";

// const wrap = { maxWidth: "380px", margin: "80px auto", padding: "24px", border: "1px solid #ddd", borderRadius: "8px" };
// const inputStyle = { width: "100%", padding: "8px", marginBottom: "4px", boxSizing: "border-box" };

// const Login = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const res = await API.post("/auth/login", form);
//       login(res.data.user, res.data.token);

//       const role = res.data.user.role;
//       if (role === "admin") navigate("/admin/dashboard");
//       else if (role === "store_owner") navigate("/owner/dashboard");
//       else navigate("/stores");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed.");
//     }
//   };

//   return (
//     <div style={wrap}>
//       <h2 style={{ textAlign: "center" }}>Login</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <label>Email</label>
//         <input style={inputStyle} type="email" value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })} required />

//         <label>Password</label>
//         <input style={inputStyle} type="password" value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })} required />

//         <button type="submit" style={{ width: "100%", padding: "9px", marginTop: "12px" }}>
//           Login
//         </button>
//       </form>
//       <p style={{ textAlign: "center", marginTop: "12px" }}>
//         Don't have an account? <Link to="/register">Register</Link>
//       </p>
//     </div>
//   );
// };

// export default Login;



import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.user, res.data.token);

      const role = res.data.user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "store_owner") navigate("/owner/dashboard");
      else navigate("/stores");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-stars"></div>

      <div className="login-card">
        <div className="login-badge">★ Store Rating Platform</div>

        <h2>
          Welcome <span>Back</span>
        </h2>

        <p className="login-subtitle">
          Login to continue rating stores and sharing your voice.
        </p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="login-register">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

