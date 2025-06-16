// cse340/utilities/account-validation.js

const { body, validationResult } = require("express-validator");
const accountModel = require("../models/accountModel");
const utilities = require("./");

const validate = {};

// ===========================
// Validation rules for login
// ===========================
validate.loginRules = () => [
  body("account_email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address."),
  body("account_password")
    .trim()
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters."),
];

// ==============================
// Check for login validation errors
// ==============================
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);
  const { account_email } = req.body;

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav(req.session.accountData);
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email,
    });
  }

  next();
};

// ===================================
// Validation rules for registration
// ===================================
validate.registrationRules = () => [
  body("account_firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required."),
  body("account_lastname")
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),
  body("account_email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required.")
    .custom(async (email) => {
      const existing = await accountModel.getAccountByEmail(email);
      if (existing) {
        throw new Error("That email is already registered.");
      }
    }),
  body("account_password")
    .trim()
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters.")
    .matches(/(?=.*\d)/)
    .withMessage("Password must contain at least one digit.")
    .matches(/(?=.*[a-z])/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/(?=.*[A-Z])/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/(?=.*[^a-zA-Z0-9])/)
    .withMessage("Password must contain at least one special character."),
];

// ===================================
// Check for registration validation errors
// ===================================
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req);
  const { account_firstname, account_lastname, account_email } = req.body;

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav(req.session.accountData);
    return res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  next();
};

// ===================================
// Validation rules for account update
// ===================================
validate.updateAccountRules = () => [
  body("account_firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required."),
  body("account_lastname")
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),
  body("account_email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required.")
    .custom(async (account_email, { req }) => {
      const existingAccount = await accountModel.getAccountByEmail(account_email);
      const currentId = parseInt(req.params.accountId, 10);
      if (existingAccount && existingAccount.account_id !== currentId) {
        throw new Error("That email is already in use. Please use a different one.");
      }
    }),
];

// ===================================
// Middleware to check update errors
// ===================================
validate.checkUpdateAccountData = async (req, res, next) => {
  const errors = validationResult(req);
  const accountId = req.params.accountId;
  const accountData = {
    account_id: accountId,
    account_firstname: req.body.account_firstname,
    account_lastname: req.body.account_lastname,
    account_email: req.body.account_email,
  };

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav(req.session.accountData);
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      errors: errors.array(),
      notice: req.flash("notice") || [],
    });
  }

  next();
};

// ======================================
// Validation for password update form
// ======================================
validate.updatePasswordRules = () => [
  body("account_password")
    .trim()
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters.")
    .matches(/(?=.*\d)/)
    .withMessage("Password must contain at least one digit.")
    .matches(/(?=.*[a-z])/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/(?=.*[A-Z])/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/(?=.*[^a-zA-Z0-9])/)
    .withMessage("Password must contain at least one special character."),
];

validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  const accountId = req.params.accountId;
  const nav = await utilities.getNav(req.session.accountData);

  if (!errors.isEmpty()) {
    const accountData = await accountModel.getAccountById(accountId);
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      errors: errors.array(),
      notice: req.flash("notice") || [],
    });
  }

  next();
};

module.exports = validate;
