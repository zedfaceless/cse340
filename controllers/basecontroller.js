const utilities = require("../utilities")
const basecontroller = {}

basecontroller.buildHome = async function(req, res){
 const nav = await utilities.getNav()
res.render("layouts/index", {title: "Home", nav})
}

module.exports = basecontroller