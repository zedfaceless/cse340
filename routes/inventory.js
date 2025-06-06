const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const invVal = require('../utilities/inventory-validation'); // Validation middleware

// Display vehicle classifications
router.get('/classifications', inventoryController.buildInventory);

// Display vehicles by classification ID
router.get('/type/:classification_id', inventoryController.buildByClassification);

// Display vehicle detail view
router.get('/detail/:inv_id', inventoryController.buildVehicleDetailView);

// Show add classification form
router.get('/add-classification', inventoryController.showAddClassificationForm);

// Handle add classification POST with validation
router.post(
  '/add-classification',
  invVal.classificationRules(),
  invVal.checkClassificationData,
  inventoryController.addClassification
);

// Show add inventory form
router.get('/add-inventory', inventoryController.showAddInventoryForm);

// Handle add inventory item POST with validation
router.post(
  '/add-inventory',
  invVal.inventoryRules(),
  invVal.checkInventoryData,
  inventoryController.addInventoryItem
);

// Default management view (keep this last)
router.get('/', inventoryController.showManagementView);

module.exports = router;
