const { validationResult } = require("express-validator");
const db = require("../config/db");

// ─── Admin: Add New Store ─────────────────────────────────────────────────────
const addStore = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, address, owner_id } = req.body;

  try {
    // If owner_id is given, verify the user exists and is a store_owner
    if (owner_id) {
      const [owner] = await db.query(
        "SELECT id, role FROM users WHERE id = ? AND role = 'store_owner'",
        [owner_id]
      );
      if (owner.length === 0) {
        return res.status(400).json({
          message: "Owner ID does not belong to a valid store owner user.",
        });
      }
    }

    const [result] = await db.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, owner_id || null]
    );

    return res.status(201).json({
      message: "Store created successfully.",
      storeId: result.insertId,
    });
  } catch (err) {
    console.error("Add store error:", err);
    return res.status(500).json({ message: "Error creating store." });
  }
};

// ─── Admin: Get All Stores (with filters + sorting) ───────────────────────────
const getAdminStores = async (req, res) => {
  const { name, email, address, sortBy, order } = req.query;

  const allowedSortFields = ["name", "email", "address", "avg_rating", "created_at"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "created_at";
  const sortOrder = order === "asc" ? "ASC" : "DESC";

  let query = `
    SELECT 
      s.id, s.name, s.email, s.address, s.created_at,
      u.name AS owner_name,
      ROUND(AVG(r.rating), 1) AS avg_rating,
      COUNT(r.id) AS total_ratings
    FROM stores s
    LEFT JOIN users u ON u.id = s.owner_id
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1
  `;
  const params = [];

  if (name) {
    query += " AND s.name LIKE ?";
    params.push(`%${name}%`);
  }
  if (email) {
    query += " AND s.email LIKE ?";
    params.push(`%${email}%`);
  }
  if (address) {
    query += " AND s.address LIKE ?";
    params.push(`%${address}%`);
  }

  query += ` GROUP BY s.id ORDER BY ${sortField === "avg_rating" ? "avg_rating" : `s.${sortField}`} ${sortOrder}`;

  try {
    const [stores] = await db.query(query, params);
    return res.status(200).json(stores);
  } catch (err) {
    console.error("Get admin stores error:", err);
    return res.status(500).json({ message: "Error fetching stores." });
  }
};

// ─── Normal User: Get All Stores (with user's rating) ────────────────────────
const getUserStores = async (req, res) => {
  const { name, address, sortBy, order } = req.query;
  const userId = req.user.id;

  const allowedSortFields = ["name", "address", "avg_rating"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
  const sortOrder = order === "asc" ? "ASC" : "DESC";

  let query = `
    SELECT 
      s.id, s.name, s.address,
      ROUND(AVG(r.rating), 1) AS avg_rating,
      ur.id AS user_rating_id,
      ur.rating AS user_rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
    WHERE 1=1
  `;
  const params = [userId];

  if (name) {
    query += " AND s.name LIKE ?";
    params.push(`%${name}%`);
  }
  if (address) {
    query += " AND s.address LIKE ?";
    params.push(`%${address}%`);
  }

  query += ` GROUP BY s.id, ur.id, ur.rating ORDER BY ${sortField === "avg_rating" ? "avg_rating" : `s.${sortField}`} ${sortOrder}`;

  try {
    const [stores] = await db.query(query, params);
    return res.status(200).json(stores);
  } catch (err) {
    console.error("Get user stores error:", err);
    return res.status(500).json({ message: "Error fetching stores." });
  }
};

// Admin: Delete a Store
const deleteStore = async (req, res) => {
  const { id } = req.params;
  try {
    const [store] = await db.query("SELECT id FROM stores WHERE id = ?", [id]);
    if (store.length === 0) {
      return res.status(404).json({ message: "Store not found." });
    }
    await db.query("DELETE FROM stores WHERE id = ?", [id]);
    return res.status(200).json({ message: "Store deleted successfully." });
  } catch (err) {
    console.error("Delete store error:", err);
    return res.status(500).json({ message: "Error deleting store." });
  }
};

// ─── Admin: Get Single Store Details ─────────────────────────────────────────
const getStoreById = async (req, res) => {
  const { id } = req.params;

  try {
    const [stores] = await db.query(
      `SELECT 
        s.id, s.name, s.email, s.address, s.created_at,
        u.name AS owner_name,
        ROUND(AVG(r.rating), 1) AS avg_rating,
        COUNT(r.id) AS total_ratings
       FROM stores s
       LEFT JOIN users u ON u.id = s.owner_id
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.id = ?
       GROUP BY s.id`,
      [id]
    );

    if (stores.length === 0) {
      return res.status(404).json({ message: "Store not found." });
    }

    return res.status(200).json(stores[0]);
  } catch (err) {
    console.error("Get store by ID error:", err);
    return res.status(500).json({ message: "Error fetching store details." });
  }
};

module.exports = { addStore, getAdminStores, getUserStores, getStoreById, deleteStore };