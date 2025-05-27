const baseController = require("./controllers/baseController");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const env = require("dotenv").config();
const utilities = require("./utilities/");
const app = express();
const staticRoutes = require("./routes/static");
const invRouter = require("./routes/inventory"); // Renamed for clarity

// Make nav available to all views
app.use(async (req, res, next) => {
  res.locals.nav = await utilities.getNav();
  next();
});

// Mount inventory routes at /inv (this fixes your navigation route issue)
app.use("/inv", invRouter);

// Set the view engine and views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Static file routes
app.use(staticRoutes);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Local Server Information
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

// Start server
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

// Express Error Handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message =
    err.status === 404
      ? err.message
      : 'Oh no! There was a crash. Maybe try a different route?';
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav,
  });
});
