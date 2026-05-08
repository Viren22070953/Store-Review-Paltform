const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const db = require("../config/db");

// ─── Admin: Get Dashboard Counts ──────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users WHERE role != 'admin'"
    );
    const [[{ totalStores }]] = await db.query(
      "SELECT COUNT(*) AS totalStores FROM stores"
    );
    const [[{ totalRatings }]] = await db.query(
      "SELECT COUNT(*) AS totalRatings FROM ratings"
    );

    return res.status(200).json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return res.status(500).json({ message: "Error fetching dashboard stats." });
  }
};

// ─── Admin: Add New User ──────────────────────────────────────────────────────
const addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, address, role } = req.body;

  try {
    // Check if email already exists
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role]
    );

    return res.status(201).json({
      message: `User created successfully with role '${role}'.`,
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Add user error:", err);
    return res.status(500).json({ message: "Error creating user." });
  }
};

// ─── Admin: Get All Users (with filters + sorting) ────────────────────────────
const getAllUsers = async (req, res) => {
  const { name, email, address, role, sortBy, order } = req.query;

  // Whitelist sortable columns to prevent SQL injection
  const allowedSortFields = ["name", "email", "address", "role", "created_at"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "created_at";
  const sortOrder = order === "asc" ? "ASC" : "DESC";

  let query = `
    SELECT 
      u.id, u.name, u.email, u.address, u.role, u.created_at,
      ROUND(AVG(r.rating), 1) AS avg_rating
    FROM users u
    LEFT JOIN stores s ON s.owner_id = u.id
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1
  `;
  const params = [];

  if (name) {
    query += " AND u.name LIKE ?";
    params.push(`%${name}%`);
  }
  if (email) {
    query += " AND u.email LIKE ?";
    params.push(`%${email}%`);
  }
  if (address) {
    query += " AND u.address LIKE ?";
    params.push(`%${address}%`);
  }
  if (role) {
    query += " AND u.role = ?";
    params.push(role);
  }

  query += ` GROUP BY u.id ORDER BY u.${sortField} ${sortOrder}`;

  try {
    const [users] = await db.query(query, params);
    return res.status(200).json(users);
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ message: "Error fetching users." });
  }
};

// ─── Admin: Get Single User Details ──────────────────────────────────────────
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await db.query(
      `SELECT 
        u.id, u.name, u.email, u.address, u.role, u.created_at,
        ROUND(AVG(r.rating), 1) AS avg_rating
       FROM users u
       LEFT JOIN stores s ON s.owner_id = u.id
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE u.id = ?
       GROUP BY u.id`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(users[0]);
  } catch (err) {
    console.error("Get user by ID error:", err);
    return res.status(500).json({ message: "Error fetching user details." });
  }
};

// Admin: Delete a User
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.query("SELECT id, role FROM users WHERE id = ?", [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user[0].role === "admin") {
      return res.status(403).json({ message: "Cannot delete an admin user." });
    }
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ message: "Error deleting user." });
  }
};

// ─── All Roles: Update Own Password ──────────────────────────────────────────
const updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, password } = req.body;
  const userId = req.user.id;

  try {
    // Get current hashed password
    const [users] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNew = await bcrypt.hash(password, salt);

    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedNew, userId]);

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Update password error:", err);
    return res.status(500).json({ message: "Error updating password." });
  }
};

module.exports = {
  getDashboardStats,
  addUser,
  getAllUsers,
  getUserById,
  updatePassword,
  deleteUser,
};