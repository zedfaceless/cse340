/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * View Engine and Templates
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");  // Import path module
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");

app.set("view engine", "ejs");

// Set the correct views directory to point to the views folder
app.set("views", path.join(__dirname, "views")); // This sets the views directory

app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Layout file in layouts folder

/* ***********************
 * Routes
 *************************/
app.use(static);

/* ***********************
 * Index route
 *************************/
app.get("/", function(req, res){
  res.render("layouts/index", { title: "Home" }); // Update to reflect the path
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
