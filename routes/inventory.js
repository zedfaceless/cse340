const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventoryController");

router.get("/detail/:inv_id", invController.buildById);

module.exports = router;
