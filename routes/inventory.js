const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const invVal = require('../utilities/inventory-validation'); // Validation middleware

// Route to display all vehicle classifications (Step 3)
router.get('/classifications', async (req, res, next) => {
  try {
    const classificationList = await require('../models/inventory-model').getClassifications();
    res.render('inventory/classification', {
      title: 'Vehicle Classifications',
      nav: res.locals.nav,
      classificationList
    });
  } catch (err) {
    next(err);
  }
});

// Route to show vehicles by classification/type
router.get('/type/:classification_id', inventoryController.buildByClassification);

// Route to show vehicle detail
router.get('/detail/:inv_id', inventoryController.buildVehicleDetailView);

// Route to show add-classification form
router.get('/add-classification', inventoryController.showAddClassificationForm);

// Route to process add-classification form
router.post(
  '/add-classification',
  invVal.classificationRules(),
  invVal.checkClassificationData,
  inventoryController.addClassification
);

// Route to show add-inventory form
router.get('/add-inventory', inventoryController.showAddInventoryForm);

// Route to process add-inventory form
router.post(
  '/add-inventory',
  invVal.inventoryRules(),       // <-- make sure this exists in your validation file
  invVal.checkInventoryData,     // <-- make sure this exists in your validation file
  inventoryController.addInventoryItem
);

// Route to show inventory management view (keep this last to avoid conflicts)
router.get("/", inventoryController.showManagementView);

module.exports = router;
