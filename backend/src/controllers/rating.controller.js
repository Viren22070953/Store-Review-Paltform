const { validationResult } = require("express-validator");
const db = require("../config/db");

// ─── Normal User: Submit a Rating ────────────────────────────────────────────
const submitRating = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { store_id, rating } = req.body;
  const userId = req.user.id;

  try {
    // Check if store exists
    const [store] = await db.query("SELECT id FROM stores WHERE id = ?", [store_id]);
    if (store.length === 0) {
      return res.status(404).json({ message: "Store not found." });
    }

    // Check if user already rated this store
    const [existing] = await db.query(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, store_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        message: "You have already rated this store. Use the update endpoint to modify it.",
      });
    }

    const [result] = await db.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [userId, store_id, rating]
    );

    return res.status(201).json({
      message: "Rating submitted successfully.",
      ratingId: result.insertId,
    });
  } catch (err) {
    console.error("Submit rating error:", err);
    return res.status(500).json({ message: "Error submitting rating." });
  }
};

// ─── Normal User: Update an Existing Rating ───────────────────────────────────
const updateRating = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params; // rating id
  const { rating } = req.body;
  const userId = req.user.id;

  try {
    // Find the rating and verify ownership
    const [existing] = await db.query(
      "SELECT id, user_id FROM ratings WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Rating not found." });
    }

    if (existing[0].user_id !== userId) {
      return res.status(403).json({ message: "You can only update your own ratings." });
    }

    await db.query("UPDATE ratings SET rating = ? WHERE id = ?", [rating, id]);

    return res.status(200).json({ message: "Rating updated successfully." });
  } catch (err) {
    console.error("Update rating error:", err);
    return res.status(500).json({ message: "Error updating rating." });
  }
};

// ─── Store Owner: Get Own Store Dashboard ────────────────────────────────────
const getOwnerDashboard = async (req, res) => {
  const ownerId = req.user.id;

  try {
    // Get the store belonging to this owner
    const [stores] = await db.query(
      "SELECT id, name, address FROM stores WHERE owner_id = ?",
      [ownerId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        message: "No store found for your account. Please contact the admin.",
      });
    }

    const store = stores[0];

    // Get average rating for the store
    const [[{ avg_rating, total_ratings }]] = await db.query(
      `SELECT 
        ROUND(AVG(rating), 1) AS avg_rating,
        COUNT(*) AS total_ratings
       FROM ratings WHERE store_id = ?`,
      [store.id]
    );

    // Get list of users who submitted ratings along with their rating
    const [raters] = await db.query(
      `SELECT 
        u.id, u.name, u.email, r.rating, r.created_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [store.id]
    );

    return res.status(200).json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
        avg_rating: avg_rating || 0,
        total_ratings,
      },
      raters,
    });
  } catch (err) {
    console.error("Owner dashboard error:", err);
    return res.status(500).json({ message: "Error fetching owner dashboard." });
  }
};

module.exports = { submitRating, updateRating, getOwnerDashboard };