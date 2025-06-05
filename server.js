const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const dotenv = require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");

const utilities = require("./utilities/");
const baseController = require("./controllers/baseController");
const inventoryRouter = require("./routes/inventory");
const staticRoutes = require("./routes/static");
const accountRoute = require("./routes/accountRoutes");

const app = express();

// ====== MIDDLEWARE SETUP ====== //

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static("public"));

// Setup session and flash middleware (ORDER MATTERS)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecretKey123!", // fallback
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.use(flash());

// Make flash messages & validation errors globally available
app.use((req, res, next) => {
  res.locals.message = req.flash("message");
  res.locals.errors = req.flash("errors"); // <-- For validation errors
  res.locals.success = req.flash("success");
  next();
});

// Make nav available to all views
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
  } catch (error) {
    console.error("Error getting navigation:", error.message);
    res.locals.nav =
      '<ul><li><a href="/" title="Home page">Home</a></li></ul>';
  }
  next();
});

// ====== VIEW ENGINE ====== //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// ====== ROUTES ====== //
app.use("/", staticRoutes);
app.use("/inventory", inventoryRouter);
app.use("/account", accountRoute);

// Home route
app.get("/", utilities.handleErrors(baseController.buildHome));

// ====== ERROR HANDLING ====== //

// 404 not found
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

// Global error handler
app.use(async (err, req, res, next) => {
  let nav;
  try {
    nav = await utilities.getNav();
  } catch (error) {
    nav = '<ul><li><a href="/" title="Home page">Home</a></li></ul>';
  }

  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

// ====== START SERVER ====== //
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";
app.listen(port, () => {
  console.log(`App listening at http://${host}:${port}`);
});
