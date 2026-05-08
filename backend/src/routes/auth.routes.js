const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { registerValidation, loginValidation } = require("../validations/validators");

// POST /api/auth/register — Normal user self-registration
router.post("/register", registerValidation, register);

// POST /api/auth/login — All roles login
router.post("/login", loginValidation, login);

module.exports = router;