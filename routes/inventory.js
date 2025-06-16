const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const invVal = require('../utilities/inventory-validation');
const utilities = require('../utilities');

// ✅ Public routes
router.get(
  '/classifications',
  utilities.handleErrors(inventoryController.buildInventory)
);

router.get(
  '/type/:classification_id',
  utilities.handleErrors(inventoryController.buildByClassificationId)
);

router.get(
  '/detail/:inv_id',
  utilities.handleErrors(inventoryController.buildVehicleDetailView)
);

// 🔐 Protected routes — Admin or Employee only
router.get(
  '/',
  utilities.checkAccountType,
  utilities.handleErrors(inventoryController.showManagementView)
);

router.get(
  '/add-classification',
  utilities.checkAccountType,
  utilities.handleErrors(inventoryController.showAddClassificationForm)
);

router.post(
  '/add-classification',
  utilities.checkAccountType,
  invVal.classificationRules(),
  invVal.checkClassificationData,
  utilities.handleErrors(inventoryController.addClassification)
);

router.get(
  '/add-inventory',
  utilities.checkAccountType,
  utilities.handleErrors(inventoryController.showAddInventoryForm)
);

router.post(
  '/add-inventory',
  utilities.checkAccountType,
  invVal.inventoryRules(),
  invVal.checkInventoryData,
  utilities.handleErrors(inventoryController.addInventoryItem)
);

module.exports = router;
