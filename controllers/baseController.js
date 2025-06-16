const utilities = require("../utilities");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav(req.session.accountData); // ✅ pass login info
  res.render("layouts/index", {
    title: "Home",
    nav,
  });
};

module.exports = baseController;
