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
//team
router.get("/admin/team/:seasonId", controller.getAllTeam)
router.get("/admin/team/one/:id", controller.getOneTeam)
router.post("/admin/team", controller.addTeam)
router.put("/admin/team/:id", controller.modifyTeam)
router.delete("/admin/team/:id", controller.deleteTeam)
//racer
router.get("/admin/racer/:seasonId", controller.getAllRacer)
router.get("/admin/racer/one/:id", controller.getOneRacer)
router.post("/admin/racer", controller.addRacer)
router.put("/admin/racer/:id", controller.modifyRacer)
router.delete("/admin/racer/:id", controller.deleteRacer)

module.exports = router