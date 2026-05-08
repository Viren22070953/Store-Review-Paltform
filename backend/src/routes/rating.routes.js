const express = require("express");
const router = express.Router();
const {
  submitRating,
  updateRating,
  getOwnerDashboard,
} = require("../controllers/rating.controller");

const verifyToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ratingValidation } = require("../validations/validators");

// ─── Normal User Routes ───────────────────────────────────────────────────────

// POST /api/ratings — Submit a new rating
router.post(
  "/ratings",
  verifyToken,
  authorizeRoles("user"),
  ratingValidation,
  submitRating
);

// PUT /api/ratings/:id — Update an existing rating
router.put(
  "/ratings/:id",
  verifyToken,
  authorizeRoles("user"),
  [
    require("express-validator").body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5."),
  ],
  updateRating
);

// ─── Store Owner Routes ───────────────────────────────────────────────────────

// GET /api/owner/dashboard — Store owner dashboard
router.get(
  "/owner/dashboard",
  verifyToken,
  authorizeRoles("store_owner"),
  getOwnerDashboard
);

module.exports = router;