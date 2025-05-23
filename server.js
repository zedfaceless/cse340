/******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

const baseController = require("./controllers/baseController");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const env = require("dotenv").config();
const utilities = require("./utilities/"); // <-- make sure this is required here for getNav()
const app = express();
const staticRoutes = require("./routes/static");

// Set the view engine and views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Static file routes
app.use(staticRoutes);

/* ***********************
 * Index route
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome));

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});

/* ***********************
 * File Not Found Route - must be last route in list
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})
