const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function escapeHtml(text) {
  return text
    ?.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function getNav(accountData = null) {
  try {
    const data = await invModel.getClassifications();

    let nav = `<ul>`;
    nav += `<li><a href="/" title="Home page">Home</a></li>`;

    // ✅ Only show New Cars if Admin/Employee
    if (
      accountData &&
      (accountData.account_type === "Admin" || accountData.account_type === "Employee")
    ) {
      nav += `<li><a href="/inventory" title="Inventory Management">New Cars</a></li>`;
    }

    data.forEach((row) => {
      nav += `<li><a href="/inventory/type/${row.classification_id}" title="See our ${escapeHtml(
        row.classification_name
      )} vehicles">${escapeHtml(row.classification_name)}</a></li>`;
    });

    nav += `</ul>`;
    return nav;
  } catch (error) {
    console.error("Error building nav:", error.message);
    return `<ul><li><a href="/" title="Home page">Home</a></li></ul>`;
  }
}

function buildClassificationGrid(data) {
  let grid = '<ul id="inv-display">';
  data.forEach((vehicle) => {
    grid += `
      <li>
        <a href="/inventory/detail/${vehicle.inv_id}" title="View ${escapeHtml(
      vehicle.inv_make
    )} ${escapeHtml(vehicle.inv_model)} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${escapeHtml(
      vehicle.inv_make
    )} ${escapeHtml(vehicle.inv_model)} on CSE Motors">
        </a>
        <div class="namePrice">
          <h2>
            <a href="/inventory/detail/${vehicle.inv_id}" title="View ${escapeHtml(
      vehicle.inv_make
    )} ${escapeHtml(vehicle.inv_model)} details">
              ${escapeHtml(vehicle.inv_make)} ${escapeHtml(vehicle.inv_model)}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat().format(vehicle.inv_price)}</span>
        </div>
      </li>
    `;
  });
  grid += "</ul>";
  return grid;
}

function buildVehicleDetailHTML(vehicle) {
  const priceFormatted =
    vehicle.inv_price?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }) || "N/A";

  const mileageFormatted = vehicle.inv_miles?.toLocaleString("en-US") || "N/A";

  return `
    <div class="vehicle-detail-container">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="Image of ${escapeHtml(
    vehicle.inv_make
  )} ${escapeHtml(vehicle.inv_model)}" />
      </div>
      <div class="vehicle-info">
        <h1>${escapeHtml(vehicle.inv_make)} ${escapeHtml(vehicle.inv_model)}</h1>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Price:</strong> ${priceFormatted}</p>
        <p><strong>Mileage:</strong> ${mileageFormatted} miles</p>
        <p><strong>Description:</strong> ${escapeHtml(vehicle.inv_description)}</p>
        <p><strong>Color:</strong> ${escapeHtml(vehicle.inv_color)}</p>
      </div>
    </div>
  `;
}

function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function checkJWTToken(req, res, next) {
  if (req.cookies && req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        req.flash("message", "Session expired. Please log in again.");
        res.clearCookie("jwt");
        return res.redirect("/account/login");
      }
      res.locals.accountData = accountData;
      res.locals.loggedin = 1;
      req.session.accountData = accountData; // ✅ Set session for consistency
      next();
    });
  } else {
    next();
  }
}

function checkAccountType(req, res, next) {
  // Prefer accountData from res.locals, fallback to session
  const account =
    res.locals.accountData || req.session.accountData;

  if (account && (account.account_type === "Admin" || account.account_type === "Employee")) {
    res.locals.accountData = account; // Ensure nav still works
    return next();
  }

  req.flash("message", "You must be logged in with Admin or Employee privileges.");
  return res.redirect("/account/login");
}

module.exports = {
  getNav,
  buildClassificationGrid,
  buildVehicleDetailHTML,
  handleErrors,
  checkJWTToken,
  checkAccountType,
};
