const express = require("express");
const path = require("path");
const router = express.Router();

// Serve all static files from the 'public' directory
router.use(express.static(path.join(__dirname, "../public")));

module.exports = router;
