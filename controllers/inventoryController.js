const inventoryModel = require('../models/inventory-model');
const { buildVehicleDetailHTML } = require('../utilities');

async function buildVehicleDetailView(req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicleData = await inventoryModel.getVehicleById(inv_id);
    
    if (!vehicleData) {
      return res.status(404).send('Vehicle not found');
    }

    const vehicleHTML = buildVehicleDetailHTML(vehicleData);

    res.render('inventory/detail', {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      vehicleHTML,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildVehicleDetailView,
};
