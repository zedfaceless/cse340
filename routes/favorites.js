const express = require("express")
const router = express.Router()
const favoritesController = require("../controllers/favoritesController")
const utilities = require("../utilities/")

router.get("/", utilities.checkLogin, favoritesController.showFavorites)
router.get("/add/:inv_id", utilities.checkLogin, favoritesController.addFavorite)
router.get("/remove/:inv_id", utilities.checkLogin, favoritesController.removeFavorite)

module.exports = router
