const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const Util = require('../utilities/index');

// Route to render main inventory page with navigation
router.get('/', async (req, res, next) => {
  try {
    const nav = await Util.getNav();
    res.render('index', { nav });  // Adjust 'index' to your actual main view filename if different
  } catch (error) {
    next(error);
  }
});

// Route for vehicle detail view
router.get('/detail/:inv_id', inventoryController.buildVehicleDetailView);

module.exports = router;
