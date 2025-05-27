const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/detail/:inv_id', inventoryController.buildVehicleDetailView);

module.exports = router;
