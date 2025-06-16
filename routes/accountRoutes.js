const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to build account management view
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to build update account view
router.get(
  "/update/:accountId",
  utilities.checkJWTToken,
  // Optional: ensure logged-in user (requires requireLogin in utilities)
  // utilities.requireLogin,
  utilities.handleErrors(accountController.buildUpdateAccountForm)
);

// Route to handle account information update
router.post(
  "/update/:accountId",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
);

// Route to handle password update
router.post(
  "/update-password/:accountId",
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordUpdate,
  utilities.handleErrors(accountController.updatePassword)
);

// Route to handle login process
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to handle registration process
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Route to handle logout
router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;
