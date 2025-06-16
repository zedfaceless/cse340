const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const dotenv = require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

// ✅ Load utilities for JWT and nav
const utilities = require("./utilities/");
const baseController = require("./controllers/baseController");

// ✅ Load routers
const inventoryRouter = require("./routes/inventory");
const staticRoutes = require("./routes/static");
const accountRoute = require("./routes/accountRoutes");

const app = express();

// ====== MIDDLEWARE SETUP ====== //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

// Session and flash setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecretKey123!",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);
app.use(flash());

// ✅ Apply JWT middleware globally
app.use(utilities.checkJWTToken);

// Middleware to expose flash messages to views
app.use((req, res, next) => {
  res.locals.message = req.flash("message");
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");
  next();
});

// ✅ Inject nav menu with account info
app.use(async (req, res, next) => {
  try {
    const accountData = req.session.accountData || null;
    res.locals.nav = await utilities.getNav(accountData);
  } catch (error) {
    console.error("Error getting navigation:", error.message);
    res.locals.nav = '<ul><li><a href="/" title="Home page">Home</a></li></ul>';
  }
  next();
});

// ====== VIEW ENGINE ====== //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// ====== ROUTES ====== //

// Static routes (Home, About, etc.)
if (typeof staticRoutes === "function") {
  app.use("/", staticRoutes);
} else {
  console.error("⚠️ staticRoutes is not a router. Check exports in routes/static.js");
}

// ✅ Redirect old /inv/* paths to /inventory/*
app.use("/inv", (req, res, next) => {
  const validPaths = [
    "/add-classification",
    "/add-inventory",
    /^\/type\/\d+$/,
    /^\/detail\/\d+$/,
    "/",
  ];
  const pathOnly = req.path;
  const shouldRedirect = validPaths.some((rule) =>
    typeof rule === "string" ? pathOnly === rule : rule.test(pathOnly)
  );
  if (shouldRedirect) {
    const newUrl = req.originalUrl.replace(/^\/inv/, "/inventory");
    return res.redirect(301, newUrl);
  }
  next();
});

// Inventory routes
if (typeof inventoryRouter === "function") {
  app.use("/inventory", inventoryRouter);
} else {
  console.error("⚠️ inventoryRouter is not a router. Check exports in routes/inventory.js");
}

// Account routes
if (typeof accountRoute === "function") {
  app.use("/account", accountRoute);
} else {
  console.error("⚠️ accountRoute is not a router. Check exports in routes/accountRoutes.js");
}

// Home route
app.get("/", utilities.handleErrors(baseController.buildHome));

// ====== ERROR HANDLING ====== //
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

app.use(async (err, req, res, next) => {
  let nav;
  try {
    const accountData = req.session.accountData || null;
    nav = await utilities.getNav(accountData);
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
  console.log(`✅ App listening at http://${host}:${port}`);
});
