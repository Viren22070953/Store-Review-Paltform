const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  addUser,
  getAllUsers,
  getUserById,
  updatePassword,
    deleteUser,
} = require("../controllers/user.controller");

const verifyToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { addUserValidation, updatePasswordValidation } = require("../validations/validators");

// ─── Admin Only Routes ────────────────────────────────────────────────────────

// GET /api/admin/dashboard — Dashboard stats
router.get(
  "/admin/dashboard",
  verifyToken,
  authorizeRoles("admin"),
  getDashboardStats
);

// POST /api/admin/users — Add a new user (any role)
router.post(
  "/admin/users",
  verifyToken,
  authorizeRoles("admin"),
  addUserValidation,
  addUser
);

// GET /api/admin/users — List all users with filters
router.get(
  "/admin/users",
  verifyToken,
  authorizeRoles("admin"),
  getAllUsers
);

// GET /api/admin/users/:id — Get single user details
router.get(
  "/admin/users/:id",
  verifyToken,
  authorizeRoles("admin"),
  getUserById
);

// DELETE /api/admin/users/:id — Delete a user
router.delete(
  "/admin/users/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteUser
);

// ─── All Authenticated Users ──────────────────────────────────────────────────

// PUT /api/users/password — Update own password
router.put(
  "/users/password",
  verifyToken,
  authorizeRoles("admin", "user", "store_owner"),
  updatePasswordValidation,
  updatePassword
);

module.exports = router;