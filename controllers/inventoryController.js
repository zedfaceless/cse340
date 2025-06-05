const path = require('path');
const inventoryModel = require('../models/inventory-model');

// Controller to render list of vehicle classifications at /inv
async function buildInventory(req, res, next) {
  try {
    const classificationList = await inventoryModel.getClassifications(); // get all classifications
    res.render("inventory/classification", {
      title: "Vehicle Classifications",
      nav: res.locals.nav,
      classificationList,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

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

    if (!classification_name || classification_name.trim().length === 0) {
      return res.status(400).render('inventory/add-classification', {
        title: 'Add Classification',
        nav: res.locals.nav,
        errors: ['Classification name is required.'],
        classification_name: classification_name,
      });
    }

    const result = await inventoryModel.addClassification(classification_name);

    if (result) {
      req.flash('message', `Classification "${classification_name}" added successfully.`);
      return res.redirect('/inv');
    } else {
      throw new Error('Failed to add classification');
    }
  } catch (error) {
    next(error);
  }
}

/* ===== NEW CONTROLLERS FOR ADD INVENTORY ===== */

// Render Add Inventory Form
async function showAddInventoryForm(req, res, next) {
  try {
    const classificationList = await inventoryModel.getClassifications();

    // Build classification dropdown options HTML
    let classificationOptions = '<select id="classification_id" name="classification_id" required>';
    classificationOptions += '<option value="">Choose a Classification</option>';
    classificationList.forEach(classification => {
      classificationOptions += `<option value="${classification.classification_id}">${classification.classification_name}</option>`;
    });
    classificationOptions += '</select>';

    res.render('inventory/add-inventory', {
      title: 'Add Inventory Item',
      nav: res.locals.nav,
      errors: null,
      classificationList: classificationOptions,
      inv_make: '',
      inv_model: '',
      inv_year: '',
      inv_description: '',
      inv_price: '',
      inv_miles: '',
      inv_color: '',
      inv_image: '/images/no-image-available.png',
      inv_thumbnail: '/images/no-image-available.png',
    });
  } catch (error) {
    next(error);
  }
}

// Handle POST Add Inventory Item
async function addInventoryItem(req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
    } = req.body;

    // Call the model to insert the inventory item
    const result = await inventoryModel.addInventoryItem({
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
    });

    if (result) {
      req.flash('message', `Inventory item "${inv_make} ${inv_model}" added successfully.`);
      return res.redirect('/inv');
    } else {
      throw new Error('Failed to add inventory item');
    }
  } catch (error) {
    // On error, re-render form with sticky data and error messages
    try {
      const classificationList = await inventoryModel.getClassifications();
      let classificationOptions = '<select id="classification_id" name="classification_id" required>';
      classificationOptions += '<option value="">Choose a Classification</option>';
      classificationList.forEach(classification => {
        const selected = classification.classification_id.toString() === req.body.classification_id ? 'selected' : '';
        classificationOptions += `<option value="${classification.classification_id}" ${selected}>${classification.classification_name}</option>`;
      });
      classificationOptions += '</select>';

      res.render('inventory/add-inventory', {
        title: 'Add Inventory Item',
        nav: res.locals.nav,
        errors: [ { msg: error.message } ],
        classificationList: classificationOptions,
        ...req.body,
      });
    } catch (renderError) {
      next(renderError);
    }
  }
}

module.exports = {
  buildInventory,
  buildVehicleDetailView,
  buildByClassification,
  showManagementView,
  showAddClassificationForm,
  addClassification,
  showAddInventoryForm,  // <-- NEW
  addInventoryItem       // <-- NEW
};
