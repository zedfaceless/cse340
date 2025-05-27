const invModel = require("../models/inventory-model");

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications(); // data is an array
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inventory/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Error building nav:", error);
    // fallback nav in case of error
    return "<ul><li><a href='/' title='Home page'>Home</a></li></ul>";
  }
};

/* ************************
 * Builds HTML for vehicle detail view
 ************************** */
Util.buildVehicleDetailHTML = function (vehicle) {
  const priceFormatted = vehicle.inv_price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const mileageFormatted = vehicle.inv_miles.toLocaleString("en-US");

  return `
    <div class="vehicle-detail-container">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
      </div>
      <div class="vehicle-info">
        <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Price:</strong> ${priceFormatted}</p>
        <p><strong>Mileage:</strong> ${mileageFormatted} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      </div>
    </div>
  `;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other functions in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
