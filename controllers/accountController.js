const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utilities = require("../utilities/");
const accountModel = require("../models/accountModel");

// =====================
// Build Views
// =====================

async function buildLogin(req, res) {
  const nav = await utilities.getNav(req.session.accountData);
  res.render("account/login", {
    title: "Login",
    nav,
    errors: [],
    account_email: "",
    notice: req.flash("success"),
  });
}

async function buildRegister(req, res) {
  const nav = await utilities.getNav(req.session.accountData);
  res.render("account/register", {
    title: "Register",
    nav,
    errors: [],
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
}

async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav(req.session.accountData);
  const accountData = req.session.accountData;

  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    accountData,
    notice: req.flash("success"),
  });
}

async function buildUpdateAccountForm(req, res) {
  const accountId = req.params.accountId;
  const accountData = await accountModel.getAccountById(accountId);
  const nav = await utilities.getNav(req.session.accountData);

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    accountData,
    errors: [],
    notice: req.flash("notice"),
  });
}

// =====================
// POST: Register Account
// =====================

async function registerAccount(req, res) {
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
  } else if (
    !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/.test(account_password)
  ) {
    errors.push({
      msg: "Password must be at least 12 characters and include a number, a capital letter, and a special character.",
    });
  }

  if (errors.length > 0) {
    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  try {
    const existingAccount = await accountModel.getAccountByEmail(account_email);
    if (existingAccount) {
      errors.push({ msg: "Email is already registered. Please use another." });
      return res.render("account/register", {
        title: "Register",
        nav,
        errors,
        account_firstname,
        account_lastname,
        account_email,
      });
    }

    const hashedPassword = await bcrypt.hash(account_password, 10);
    const accountResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (accountResult) {
      req.flash("success", "Registration successful! Please log in.");
      return res.redirect("/account/login");
    } else {
      errors.push({ msg: "Registration failed. Please try again." });
      return res.render("account/register", {
        title: "Register",
        nav,
        errors,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    errors.push({ msg: "An error occurred during registration. Please try again." });
    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

// =====================
// POST: Login Account
// =====================

async function accountLogin(req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const errors = [];

  if (!account_email || !account_password) {
    errors.push({ msg: "Please provide both email and password." });
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
      notice: [],
    });
  }

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      errors.push({ msg: "Invalid email or password." });
      return res.render("account/login", {
        title: "Login",
        nav,
        errors,
        account_email,
        notice: [],
      });
    }

    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
    if (!passwordMatch) {
      errors.push({ msg: "Invalid email or password." });
      return res.render("account/login", {
        title: "Login",
        nav,
        errors,
        account_email,
        notice: [],
      });
    }

    const token = jwt.sign(
      {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    req.session.accountData = accountData;
    req.flash("success", `Welcome back, ${accountData.account_firstname}!`);
    return res.redirect("/account");

  } catch (error) {
    console.error("Login error:", error);
    errors.push({ msg: "An error occurred during login. Please try again." });
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
      notice: [],
    });
  }
}

// =====================
// GET: Logout
// =====================

function logoutAccount(req, res) {
  res.clearCookie("jwt");
  req.session.accountData = null;
  req.flash("success", "You have been logged out.");
  res.redirect("/");
}

// =====================
// POST: Update Password
// =====================

async function updatePassword(req, res) {
  const { accountId } = req.params;
  const { account_password } = req.body;
  const errors = [];
  const nav = await utilities.getNav(req.session.accountData);

  if (
    !account_password ||
    !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/.test(account_password)
  ) {
    errors.push({
      msg: "Password must be at least 12 characters and include a number, a capital letter, and a special character.",
    });
  }

  if (errors.length > 0) {
    const accountData = await accountModel.getAccountById(accountId);
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      errors,
      notice: req.flash("notice"),
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(accountId, hashedPassword);

    if (updateResult) {
      req.flash("notice", "Password updated successfully.");
      return res.redirect("/account");
    } else {
      throw new Error("Update failed");
    }
  } catch (err) {
    console.error("Password update error:", err);
    const accountData = await accountModel.getAccountById(accountId);
    errors.push({ msg: "An error occurred. Please try again." });
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      errors,
      notice: req.flash("notice"),
    });
  }
}

// =====================
// POST: Update Account Info
// =====================

async function updateAccountInfo(req, res) {
  const { accountId } = req.params;
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = [];
  const nav = await utilities.getNav(req.session.accountData);

  if (!account_firstname?.trim()) errors.push({ msg: "First name is required." });
  if (!account_lastname?.trim()) errors.push({ msg: "Last name is required." });

  if (!account_email?.trim()) {
    errors.push({ msg: "Email is required." });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account_email)) {
    errors.push({ msg: "Invalid email format." });
  }

  if (errors.length > 0) {
    const accountData = await accountModel.getAccountById(accountId);
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      errors,
      notice: req.flash("notice"),
    });
  }

  try {
    const result = await accountModel.updateAccount(accountId, account_firstname, account_lastname, account_email);

    if (result) {
      req.flash("success", "Account information updated successfully.");
      req.session.accountData.account_firstname = account_firstname;
      req.session.accountData.account_lastname = account_lastname;
      req.session.accountData.account_email = account_email;
      return res.redirect("/account");
    } else {
      throw new Error("Update failed");
    }
  } catch (err) {
    console.error("Update error:", err);
    const accountData = await accountModel.getAccountById(accountId);
    errors.push({ msg: "An error occurred. Please try again." });
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      errors,
      notice: req.flash("notice"),
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  buildAccountManagement,
  buildUpdateAccountForm,
  registerAccount,
  accountLogin,
  logoutAccount,
  updatePassword,
  updateAccountInfo,
};
