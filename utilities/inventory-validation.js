const utilities = require("../utilities");
const { body, validationResult } = require("express-validator");
const validate = {};

/* Inventory Item Data Validation Rules */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please select a classification."),

    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle make.")
      .matches(/^[A-Za-z0-9\s\-]+$/)
      .withMessage("Make can only contain letters, numbers, spaces, and hyphens."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle model.")
      .matches(/^[A-Za-z0-9\s\-]+$/)
      .withMessage("Model can only contain letters, numbers, spaces, and hyphens."),

    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle year.")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}.`),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a description.")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long."),

    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Please provide a price.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Please provide mileage.")
      .isInt({ min: 0 })
      .withMessage("Mileage must be a positive integer."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Please provide a color.")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Color can only contain letters and spaces."),

    body("inv_image")
      .optional({ checkFalsy: true })
      .trim(),

    body("inv_thumbnail")
      .optional({ checkFalsy: true })
      .trim(),
  ];
}

/* Check inventory data and return errors or continue */
validate.checkInventoryData = async (req, res, next) => {
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

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();

    // Build classification dropdown with sticky selection
    const inventoryModel = require("../models/inventory-model");
    const classificationList = await inventoryModel.getClassifications();

    let classificationOptions = '<select id="classification_id" name="classification_id" required>';
    classificationOptions += '<option value="">Choose a Classification</option>';
    classificationList.forEach(classification => {
      const selected = classification.classification_id.toString() === classification_id ? 'selected' : '';
      classificationOptions += `<option value="${classification.classification_id}" ${selected}>${classification.classification_name}</option>`;
    });
    classificationOptions += '</select>';

    res.render("inventory/add-inventory", {
      errors: errors.array(),
      title: "Add Inventory Item",
      nav,
      classificationList: classificationOptions,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image: inv_image || '/images/no-image-available.png',
      inv_thumbnail: inv_thumbnail || '/images/no-image-available.png',
    });
    return;
  }
  next();
}

module.exports = validate;
