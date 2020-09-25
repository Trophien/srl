var express = require("express")
var router = express.Router()
var controller = require("./controllers/controller")

router.post("/login", controller.login)

router.get("/session", controller.session)

router.post("/logout", controller.logout)

router.get("/seasonnotarchived", controller.getNotArchivedSeason)

// pontok kilistázása
router.post("/racerpoint", controller.getRacerPoint)

router.post("/teampoint", controller.getTeamPoint)

// admin
// season
router.get("/season", controller.getAllSeason)
router.post("/season", controller.addSeason)
router.put("/season", controller.modifySeason)
router.put("/seasonarchived", controller.modifySeasonArchived)
router.delete("/season", controller.deleteSeason)
//track
router.get("/track/:seasonId", controller.getAllTrack)
router.post("/track", controller.addTrack)
router.put("/track", controller.modifyTrack)
router.delete("/track", controller.deleteTrack)

module.exports = router