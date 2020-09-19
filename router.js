var express = require("express")
var router = express.Router()
var controller = require("./controllers/controller")

router.post("/login", controller.login)

router.get("/session", controller.session)

router.post("/logout", controller.logout)

// szezonok kilistázása
router.get("/season", controller.getAllSeason)

// pontok kilistázása
router.post("/racerpoint", controller.getRacerPoint)

router.post("/teampoint", controller.getTeamPoint)

// admin
router.put("/season", controller.modifySeason)

module.exports = router