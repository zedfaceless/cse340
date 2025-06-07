// cse340/utilities/account-validation.js

const { body, validationResult } = require("express-validator");
const validate = {};

// Validation rules for login form
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address."),

    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters.")
  ];
};

// Check for validation errors and re-render form with messages
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const utilities = require("./");
    const nav = await utilities.getNav();
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email
    });
  }

  next();
};

module.exports = validate;
