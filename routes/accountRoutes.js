// cse340/routes/accountRoutes.js
const express = require("express");
const router = express.Router();

const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities/");

// Route to display the login page
router.get("/login", accountController.buildLogin);

// Route to display the registration page
router.get("/register", accountController.buildRegister);

// Route to handle registration form submission
router.post("/register", accountController.registerAccount);

// Route to handle login form submission with validation middleware
router.post(
  "/login",
  regValidate.loginRules(),     // Validation rules for login input
  regValidate.checkLoginData,   // Middleware to check validation results
  utilities.handleErrors(accountController.accountLogin) // Controller with error handling
);

// ✅ Route to handle logout and clear cookie
router.get("/logout", accountController.logoutAccount);

module.exports = router;
