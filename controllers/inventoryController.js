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
      req.flash("success", `Classification "${classification_name}" added successfully.`);
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
      req.flash("success", `Inventory item "${inv_make} ${inv_model}" added successfully.`);
      return res.redirect("/inventory");
    } else {
      throw new Error("Failed to add inventory item.");
    }
  } catch (error) {
    const classificationList = await inventoryModel.getClassifications();
    let classificationOptions = '<select id="classification_id" name="classification_id" required>';
    classificationOptions += '<option value="">Choose a Classification</option>';
    classificationList.forEach(c => {
      const selected = c.classification_id.toString() === classification_id ? 'selected' : '';
      classificationOptions += `<option value="${c.classification_id}" ${selected}>${c.classification_name}</option>`;
    });
    classificationOptions += '</select>';

    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav: res.locals.nav,
      errors: [{ msg: error.message }],
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
}
