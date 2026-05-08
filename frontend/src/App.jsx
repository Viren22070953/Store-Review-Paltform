import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";

import HomePage from "./pages/HomePage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageStores from "./pages/admin/ManageStores";

import StoreList from "./pages/user/StoreList";
import UpdatePassword from "./pages/user/UpdatePassword";

import OwnerDashboard from "./pages/storeowner/OwnerDashboard";

const App = () => {
  const { user } = useAuth();

  const DashboardRedirect = () => {
    if (!user) return <Navigate to="/home" />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
    if (user.role === "store_owner") return <Navigate to="/owner/dashboard" />;
    return <Navigate to="/stores" />;
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardRedirect />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={["admin"]}><ManageUsers /></ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute roles={["admin"]}><ManageStores /></ProtectedRoute>
        } />

        <Route path="/stores" element={
          <ProtectedRoute roles={["user"]}><StoreList /></ProtectedRoute>
        } />

        <Route path="/update-password" element={
          <ProtectedRoute roles={["user", "store_owner", "admin"]}><UpdatePassword /></ProtectedRoute>
        } />

        <Route path="/owner/dashboard" element={
          <ProtectedRoute roles={["store_owner"]}><OwnerDashboard /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
