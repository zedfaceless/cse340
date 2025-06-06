const path = require('path');
const { validationResult } = require('express-validator');
const inventoryModel = require('../models/inventory-model');
const utilities = require('../utilities');

// Render inventory management page
async function showManagementView(req, res) {
  res.render("inventory/management", {
    title: "Inventory Management",
    nav: res.locals.nav,
    errors: null,
    message: req.flash("message"),
  });
}

// Render classification listing (just list of classification names)
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

// ✅ Render vehicles under a classification ID (uses grid)
async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = req.params.classification_id;
    const inventoryData = await inventoryModel.getVehiclesByClassification(classificationId);

    if (!inventoryData || inventoryData.length === 0) {
      throw new Error("No vehicles found for this classification.");
    }

    const classificationName = inventoryData[0].classification_name;
    const grid = await utilities.buildClassificationGrid(inventoryData);

    res.render('inventory/classification-grid', {
      title: `${classificationName} Vehicles`,
      nav: res.locals.nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
}

// Render vehicle details
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

    res.render('inventory/details', {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      vehicle: vehicleData,
      nav: res.locals.nav,
    });
  } catch (error) {
    next(error);
  }
}

// Show form to add a classification
async function showAddClassificationForm(req, res) {
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav: res.locals.nav,
    errors: null,
    classification_name: "",
    message: null,
  });
}

// Handle POST add classification
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
      return res.redirect("/inventory");
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

// Show form to add inventory item
async function showAddInventoryForm(req, res, next) {
  try {
    const classificationList = await inventoryModel.getClassifications();

    res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav: res.locals.nav,
      errors: null,
      classificationList,
      classification_id: "",
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

// Handle POST add inventory item
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
    const classificationList = await inventoryModel.getClassifications();
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav: res.locals.nav,
      errors: errors.array(),
      classificationList,
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
      return res.redirect("/inventory");
    } else {
      throw new Error("Failed to add inventory item.");
    }
  } catch (error) {
    const classificationList = await inventoryModel.getClassifications();
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav: res.locals.nav,
      errors: [{ msg: error.message }],
      classificationList,
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
  buildByClassificationId,
  buildVehicleDetailView,
  showAddClassificationForm,
  addClassification,
  showAddInventoryForm,
  addInventoryItem,
};
