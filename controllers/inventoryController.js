const path = require('path');
const { validationResult } = require('express-validator');
const inventoryModel = require('../models/inventory-model');

// Render inventory management page
async function showManagementView(req, res) {
  res.render("inventory/management", {
    title: "Inventory Management",
    nav: res.locals.nav,
    errors: null,
    message: req.flash("message"),
  });
}

// Render vehicle classification list
async function buildInventory(req, res, next) {
  try {
    const classificationList = await inventoryModel.getClassifications();
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

// Render vehicle list by classification
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

// Render vehicle detail view
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

// Render add classification form
async function showAddClassificationForm(req, res) {
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav: res.locals.nav,
    errors: null,
    classification_name: "",
    message: null,
  });
}

// Handle add classification POST
async function addClassification(req, res) {
  const { classification_name } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav: res.locals.nav,
      errors: errors.array(),
      classification_name,
      message: null,
    });
  }

  try {
    const result = await inventoryModel.addClassification(classification_name);
    if (result) {
      req.flash("message", `Classification "${classification_name}" added successfully.`);
      return res.redirect("/inv");
    } else {
      throw new Error("Failed to add classification.");
    }
  } catch (error) {
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav: res.locals.nav,
      errors: [{ msg: error.message }],
      classification_name,
      message: null,
    });
  }
}

// Render add inventory form
async function showAddInventoryForm(req, res, next) {
  try {
    const classificationList = await inventoryModel.getClassifications();

    let classificationOptions = '<select id="classification_id" name="classification_id" required>';
    classificationOptions += '<option value="">Choose a Classification</option>';
    classificationList.forEach(c => {
      classificationOptions += `<option value="${c.classification_id}">${c.classification_name}</option>`;
    });
    classificationOptions += '</select>';

    res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
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
      inv_image: '',
      inv_thumbnail: '',
      message: null,
    });
  } catch (error) {
    next(error);
  }
}

// Handle add inventory item POST
async function addInventoryItem(req, res) {
  const errors = validationResult(req);
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

  if (!errors.isEmpty()) {
    // Re-render form with errors and sticky form data
    const classificationList = await inventoryModel.getClassifications();

    let classificationOptions = '<select id="classification_id" name="classification_id" required>';
    classificationOptions += '<option value="">Choose a Classification</option>';
    classificationList.forEach(c => {
      const selected = c.classification_id.toString() === classification_id ? 'selected' : '';
      classificationOptions += `<option value="${c.classification_id}" ${selected}>${c.classification_name}</option>`;
    });
    classificationOptions += '</select>';

    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav: res.locals.nav,
      errors: errors.array(),
      classificationList: classificationOptions,
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
      message: null,
    });
  }

  try {
    const result = await inventoryModel.addInventoryItem(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail
    );
    if (result) {
      req.flash("message", `Inventory item "${inv_make} ${inv_model}" added successfully.`);
      return res.redirect("/inv");
    } else {
      throw new Error("Failed to add inventory item.");
    }
  } catch (error) {
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav: res.locals.nav,
      errors: [{ msg: error.message }],
      classificationList: await inventoryModel.getClassifications(),
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
      message: null,
    });
  }
}

module.exports = {
  showManagementView,
  buildInventory,
  buildByClassification,
  buildVehicleDetailView,
  showAddClassificationForm,
  addClassification,
  showAddInventoryForm,
  addInventoryItem,
};
