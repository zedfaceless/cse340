// cse340/routes/accountRoutes.js
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

// Views
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);

// Form handlers
router.post("/register", accountController.registerAccount);
router.post("/login", accountController.loginAccount); // ✅ Login handler added

module.exports = router;
