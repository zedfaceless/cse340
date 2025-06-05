const path = require('path');
const inventoryModel = require('../models/inventory-model');

// Controller for Vehicle Detail Page
async function buildVehicleDetailView(req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicleData = await inventoryModel.getVehicleById(inv_id);
    
    if (!vehicleData) {
      return res.status(404).send('Vehicle not found');
    }

    if (vehicleData.inv_image && vehicleData.inv_image.trim() !== '') {
      const imageFilename = path.basename(vehicleData.inv_image);
      vehicleData.inv_image = `/images/vehicles/${imageFilename}`;
    } else {
      vehicleData.inv_image = '/images/vehicles/no-image-available.jpg';
    }

    res.render('layouts/details', {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      vehicle: vehicleData,
      nav: res.locals.nav,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for Vehicle List by Classification
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

// Controller for Inventory Management Page
async function showManagementView(req, res) {
  res.render("inventory/management", {
    title: "Inventory Management",
    nav: res.locals.nav,
    errors: null,
    message: req.flash("message")
  });
}

// Controller to render the Add Classification form
async function showAddClassificationForm(req, res) {
  let nav = res.locals.nav;
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: "",
  });
}

// Controller to handle POST add-classification
async function addClassification(req, res, next) {
  try {
    const classification_name = req.body.classification_name;

    // Basic server-side validation
    if (!classification_name || classification_name.trim().length === 0) {
      return res.status(400).render('inventory/add-classification', {
        title: 'Add Classification',
        nav: res.locals.nav,
        errors: ['Classification name is required.'],
        classification_name: classification_name,
      });
    }

    // Insert classification into DB via model
    const result = await inventoryModel.addClassification(classification_name);

    if (result) {
      req.flash('message', `Classification "${classification_name}" added successfully.`);
      return res.redirect('/inv'); // redirect to inventory management page
    } else {
      throw new Error('Failed to add classification');
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildVehicleDetailView,
  buildByClassification,
  showManagementView,
  showAddClassificationForm,
  addClassification,
};
