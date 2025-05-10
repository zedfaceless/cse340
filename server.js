/******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const env = require("dotenv").config();
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
app.get("/", function (req, res) {
  res.render("layouts/index", { title: "Home" });
});

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
