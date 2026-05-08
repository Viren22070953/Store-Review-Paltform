const { body } = require("express-validator");

// ─── Reusable field validators ────────────────────────────────────────────────

const nameValidator = body("name")
  .trim()
  .isLength({ min: 1, max: 20 })
  .withMessage("Name must be between 1 and 20 characters.");

const emailValidator = body("email")
  .trim()
  .isEmail()
  .withMessage("Please provide a valid email address.")
  .normalizeEmail();

const passwordValidator = body("password")
  .isLength({ min: 8, max: 16 })
  .withMessage("Password must be between 8 and 16 characters.")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter.")
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage("Password must contain at least one special character.");

const addressValidator = body("address")
  .trim()
  .isLength({ max: 400 })
  .withMessage("Address must not exceed 400 characters.");

// ─── Validation rule sets ─────────────────────────────────────────────────────

const registerValidation = [
  nameValidator,
  emailValidator,
  passwordValidator,
  addressValidator,
];

const loginValidation = [
  emailValidator,
  body("password").notEmpty().withMessage("Password is required."),
];

const updatePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Current password is required."),
  passwordValidator.withMessage(
    "New password must be 8-16 characters, include one uppercase letter and one special character."
  ),
];

const addUserValidation = [
  nameValidator,
  emailValidator,
  passwordValidator,
  addressValidator,
  body("role")
    .isIn(["admin", "user", "store_owner"])
    .withMessage("Role must be admin, user, or store_owner."),
];

const addStoreValidation = [
  nameValidator,
  emailValidator,
  addressValidator,
  body("owner_id")
    .optional({ nullable: true })
    .isInt()
    .withMessage("Owner ID must be a valid integer."),
];

const ratingValidation = [
  body("store_id").isInt({ min: 1 }).withMessage("Valid store ID is required."),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a number between 1 and 5."),
];

module.exports = {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  addUserValidation,
  addStoreValidation,
  ratingValidation,
};