const invModel = require("../models/inventory-model");

async function getNav() {
  try {
    const data = await invModel.getClassifications();

    let nav = `<ul>`;
    nav += `<li><a href="/" title="Home page">Home</a></li>`;

    data.forEach((row) => {
      nav += `<li><a href="/inventory/type/${row.classification_id}" title="See our ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
    });

    // Add the Add Classification tab here
    nav += `<li><a href="/inventory/add-classification" title="Add Classification">Add Classification</a></li>`;

    nav += `</ul>`;
    return nav;
  } catch (error) {
    console.error("Error building nav:", error.message);
    return `<ul><li><a href="/" title="Home page">Home</a></li></ul>`;
  }
}

function buildVehicleDetailHTML(vehicle) {
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
}

function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  getNav,
  buildVehicleDetailHTML,
  handleErrors,
};
