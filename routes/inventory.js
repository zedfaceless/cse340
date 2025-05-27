const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route to show vehicles by classification/type
router.get('/type/:classification_id', inventoryController.buildByClassification);

// Route to show vehicle detail
router.get('/detail/:inv_id', inventoryController.buildVehicleDetailView);

module.exports = router;
