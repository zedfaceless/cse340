const path = require('path');
const inventoryModel = require('../models/inventory-model');

async function buildVehicleDetailView(req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicleData = await inventoryModel.getVehicleById(inv_id);
    
    if (!vehicleData) {
      return res.status(404).send('Vehicle not found');
    }

    // Check if inv_image exists and is non-empty
    if (vehicleData.inv_image && vehicleData.inv_image.trim() !== '') {
      const imageFilename = path.basename(vehicleData.inv_image); // e.g., "wrangler.jpg"
      vehicleData.inv_image = `/images/vehicles/${imageFilename}`; // e.g., "/images/vehicles/wrangler.jpg"
    } else {
      // fallback image if none is specified
      vehicleData.inv_image = '/images/vehicles/no-image-available.jpg';
    }

    // Removed console.log here

    res.render('layouts/details', {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      vehicle: vehicleData,
      nav: res.locals.nav,
    });
  } catch (error) {
    next(error);
  }
}

async function buildByClassification(req, res, next) {
  try {
    const classificationId = req.params.classification_id;

    const inventoryData = await inventoryModel.getVehiclesByClassification(classificationId);

    const classificationName = inventoryData.length > 0 
      ? inventoryData[0].classification_name 
      : 'Unknown';

    res.render('layouts/classification', {
      title: `Vehicles in ${classificationName}`,
      inventory: inventoryData,
      nav: res.locals.nav,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildVehicleDetailView,
  buildByClassification,
};
