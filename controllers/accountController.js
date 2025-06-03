// cse340/controllers/accountController.js
const utilities = require("../utilities/");

const buildLogin = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
};

const buildRegister = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
};

const registerAccount = async (req, res) => {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  const errors = [];

  if (!account_firstname?.trim()) errors.push({ msg: "First name is required." });
  if (!account_lastname?.trim()) errors.push({ msg: "Last name is required." });

  if (!account_email?.trim()) {
    errors.push({ msg: "Email is required." });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account_email)) {
    errors.push({ msg: "Invalid email format." });
  }

  if (!account_password?.trim()) {
    errors.push({ msg: "Password is required." });
  } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/.test(account_password)) {
    errors.push({ msg: "Password must be at least 12 characters and include a number, a capital letter, and a special character." });
  }

  if (errors.length > 0) {
    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
    });
  }

  // Simulate success
  res.redirect("/account/login");
};

const loginAccount = async (req, res) => {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const errors = [];

  if (!account_email?.trim()) {
    errors.push({ msg: "Email is required." });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account_email)) {
    errors.push({ msg: "Invalid email format." });
  }

  if (!account_password?.trim()) {
    errors.push({ msg: "Password is required." });
  }

  if (errors.length > 0) {
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
    });
  }

  // Simulate login success
  res.redirect("/");
};

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
};

