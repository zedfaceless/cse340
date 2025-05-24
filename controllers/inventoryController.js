// controllers/inventoryController.js

const inventoryModel = require('../models/inventory-model');

async function buildById(req, res, next) {
  const inv_id = req.params.inv_id;
  console.log(`Requested vehicle id: ${inv_id}`);  // Debug log

  try {
    const vehicle = await inventoryModel.getVehicleById(inv_id);
    console.log('Vehicle data from DB:', vehicle);  // Debug log

    if (!vehicle) {
      console.log('Vehicle not found');
      return res.status(404).render('errors/error', {
        title: 'Vehicle Not Found',
        message: 'Sorry, the vehicle you requested was not found.',
        nav: await require('../utilities').getNav(), // include nav for layout
      });
    }

    res.render('inventory/details', {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicleData: vehicle,
    });
  } catch (error) {
    console.error('Error in buildById:', error);
    next(error);
  }
}

module.exports = {
  buildById,
};
