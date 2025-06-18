const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController.js");
const utilities = require("../utilities/");
const accountValidation = require("../utilities/account-validation");

// ----------- Account Views -----------

// Login View
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
);

// Registration View
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Account Management Dashboard
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Update Account Form View
router.get(
  "/update/:accountId",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildUpdateAccountForm)
);

// My Favorite Vehicles View
router.get(
  "/favorites",
  utilities.checkLogin,
  utilities.handleErrors(accountController.showFavorites)
);

// ----------- Account Actions -----------

// Register New Account
router.post(
  "/register",
  accountValidation.registrationRules(),
  accountValidation.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Login
router.post(
  "/login",
  accountValidation.loginRules(),
  accountValidation.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Logout
router.get(
  "/logout",
  accountController.logoutAccount
);

// === ✅ UPDATE ACCOUNT INFO ===
router.post(
  "/update/:accountId",
  accountValidation.updateAccountRules(),
  accountValidation.checkUpdateAccountData,
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.updateAccountInfo)
);

// === ✅ UPDATE ACCOUNT PASSWORD ===
router.post(
  "/update-password/:accountId",
  accountValidation.updatePasswordRules(),
  accountValidation.checkPasswordData,
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.updatePassword)
);

// === ✅ ADD A FAVORITE VEHICLE ===
router.post(
  "/favorites/add",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.addFavorite)
);

// === ✅ REMOVE A FAVORITE VEHICLE ===
router.post(
  "/favorites/remove",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.removeFavorite)
);

module.exports = router;
