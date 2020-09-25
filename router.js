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
router.get("/admin/season", controller.getAllSeason)
router.get("/admin/season/:id", controller.getOneSeason)
router.post("/admin/season", controller.addSeason)
router.put("/admin/season/:id", controller.modifySeason)
router.put("/admin/seasonarchived/:id", controller.modifySeasonArchived)
router.delete("/admin/season/:id", controller.deleteSeason)
//track
router.get("/admin/track/:seasonId", controller.getAllTrack)
router.get("/admin/track/one/:id", controller.getOneTrack)
router.post("/admin/track", controller.addTrack)
router.put("/admin/track/:id", controller.modifyTrack)
router.delete("/admin/track/:id", controller.deleteTrack)

module.exports = router