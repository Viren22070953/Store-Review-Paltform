const express = require("express");
const router = express.Router();
const {
  addStore,
  getAdminStores,
  getUserStores,
  getStoreById,
  deleteStore,
} = require("../controllers/store.controller");

const verifyToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { addStoreValidation } = require("../validations/validators");

// ─── Admin Only Routes ────────────────────────────────────────────────────────

// POST /api/admin/stores — Add a new store
router.post(
  "/admin/stores",
  verifyToken,
  authorizeRoles("admin"),
  addStoreValidation,
  addStore
);

// GET /api/admin/stores — List all stores with filters + sorting
router.get(
  "/admin/stores",
  verifyToken,
  authorizeRoles("admin"),
  getAdminStores
);

// GET /api/admin/stores/:id — Get single store details
router.get(
  "/admin/stores/:id",
  verifyToken,
  authorizeRoles("admin"),
  getStoreById
);

// DELETE /api/admin/stores/:id — Delete a store
router.delete(
  "/admin/stores/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteStore
);

// ─── Normal User Routes ───────────────────────────────────────────────────────

// GET /api/stores — List all stores with user's own rating
router.get(
  "/stores",
  verifyToken,
  authorizeRoles("user"),
  getUserStores
);

module.exports = router;