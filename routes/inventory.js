const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const invVal = require('../utilities/inventory-validation'); // Validation middleware

// Route to display all vehicle classifications
router.get('/classifications', inventoryController.buildInventory);

// Route to show vehicles by classification/type
router.get('/type/:classification_id', inventoryController.buildByClassification);

// Route to show vehicle detail view
router.get('/detail/:inv_id', inventoryController.buildVehicleDetailView);

// Route to show add classification form
router.get('/add-classification', inventoryController.showAddClassificationForm);

// Route to process add classification form submission with validation
router.post(
  '/add-classification',
  invVal.classificationRules(),
  invVal.checkClassificationData,
  inventoryController.addClassification
);

// Route to show add inventory form
router.get('/add-inventory', inventoryController.showAddInventoryForm);

// Route to process add inventory form submission with validation
router.post(
  '/add-inventory',
  invVal.inventoryRules(),
  invVal.checkInventoryData,
  inventoryController.addInventoryItem
);

// Route to show inventory management view (should be last to avoid route conflicts)
router.get('/', inventoryController.showManagementView);

module.exports = router;
