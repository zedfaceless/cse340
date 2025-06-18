const favoritesModel = require("../models/favoritesModel")
const utilities = require("../utilities/")

// Add favorite
async function addFavorite(req, res) {
  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.params.inv_id)

  try {
    await favoritesModel.addFavorite(account_id, inv_id)
    req.flash("notice", "Vehicle added to favorites.")
  } catch (err) {
    req.flash("notice", "Unable to add favorite.")
  }
  res.redirect(`/inventory/detail/${inv_id}`)
}

// Remove favorite
async function removeFavorite(req, res) {
  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.params.inv_id)

  try {
    await favoritesModel.removeFavorite(account_id, inv_id)
    req.flash("notice", "Vehicle removed from favorites.")
  } catch (err) {
    req.flash("notice", "Unable to remove favorite.")
  }
  res.redirect(`/inventory/detail/${inv_id}`)
}

// View all favorites
async function showFavorites(req, res) {
  const account_id = res.locals.accountData.account_id
  const nav = await utilities.getNav()
  try {
    const favorites = await favoritesModel.getFavoritesByAccount(account_id)
    res.render("inventory/favorites", {
      title: "My Favorites",
      nav,
      favorites
    })
  } catch (error) {
    req.flash("notice", "Unable to fetch favorites.")
    res.redirect("/")
  }
}

module.exports = { addFavorite, removeFavorite, showFavorites }
