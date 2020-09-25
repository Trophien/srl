var Database = require("../models/Database")
var Bcrypt = require("../models/Bcrypt")

exports.login = (req, res) => {
    if (req.body.username == "" || req.body.password == "")
        res.json({ error: "Valami nincs kitöltve!" })
    else {
        var db = new Database()
        var bcrypt = new Bcrypt()
        db.login(req, (result) => {
            if (result.length == 0) {
                res.json({ error: "Sikertelen bejelentkezés!" })
                db.end()
            } else {
                bcrypt.decrypt(req.body.password, result[0].password, (hash) => {
                    if (hash) {
                        req.session.userId = result[0].id
                        res.json({ success: "" })
                        db.end()
                    } else {
                        res.statusCode = 401
                        res.json({ error: "Sikertelen bejelentkezés!" })
                        db.end()
                    }
                })
            }
        })
    }
}

exports.session = (req, res) => {
    if (req.session.userId == null)
        res.json({ error: "" })
    else
        res.json({ success: "" })
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err
        res.clearCookie("session")
        res.end()
    })
}

// táblázatok

exports.getNotArchivedSeason = (req, res) => {
    var db = new Database()
    db.getNotArchivedSeason(req, (result) => {
        res.send(result)
        db.end()
    })
}

exports.getRacerPoint = (req, res) => {
    var db = new Database()
    db.getRacerPoint(req, (result) => {
        res.send(result)
        db.end()
    })
}

exports.getTeamPoint = (req, res) => {
    var db = new Database()
    db.getTeamPoint(req, (result) => {
        res.send(result)
        db.end()
    })
}

// admin

function passwordValidate(req) {
    var db = new Database()
    var bcrypt = new Bcrypt()
    db.passwordValidate(req, (result) => {
        bcrypt.decrypt(req.body.password, result[0].password, (hash) => {
            if (hash) {
                db.end()
                return 1
            } else {
                db.end()
                return 0
            }
        })
    })
}

exports.getAllSeason = (req, res) => {
    var db = new Database()
    db.getAllSeason(req, (result) => {
        res.send(result)
        db.end()
    })
}

exports.addSeason = (req, res) => {
    if (req.session.userId == null)
        res.end()
    else {
        if (req.body.name == "")
            res.json({ error: "A mező nincs kitöltve!" })
        else {
            var db = new Database()
            db.addSeason(req, (result) => {
                res.json(result)
                db.end()
            })
        }
    }
}

exports.modifySeason = (req, res) => {
    if (req.session.userId == null)
        res.end()
    else {
        if (req.body.name == "")
        res.json({ error: "A mező nincs kitöltve!" })
        else {
            var db = new Database()
            db.modifySeason(req, (result) => {
                res.json(result)
                db.end()
            })
        }
    }
}

exports.modifySeasonArchived = (req, res) => {
    if (req.session.userId == null)
        res.end()
    else {
        var db = new Database()
        db.modifySeasonArchived(req)
        db.end()
        res.json({ success: "Sikeres módosítás!" })
    }
}

exports.deleteSeason = (req, res) => {
    if (req.session.userId == null)
        res.end()
    else {
        var db = new Database()
        var bcrypt = new Bcrypt()
        db.passwordValidate(req, (result) => {
                bcrypt.decrypt(req.body.password, result[0].password, (hash) => {
                if (hash) {
                    db.deleteSeason(req)
                    res.json({ success: "Sikeres művelet!" })
                    db.end()
                } else {
                    res.json({ error: "Sikertelen művelet!" })
                    db.end()
                }
            })
        })
    }
}

// tracks

exports.getAllTrack = (req, res) => {
    var db = new Database()
    db.getAllTrack(req, (result) => {
        res.send(result)
        db.end()
    })
}

exports.addTrack = (req, res) => {
    if (req.session.userId == null)
        res.end()
    else {
        if (req.body.name == "" || req.body.code == "" || req.body.number == "")
            res.json({ error: "A mező nincs kitöltve!" })
        else {
            var db = new Database()
            db.addTrack(req, (result) => {
                res.json(result)
                db.end()
            })
        }
    }
}

exports.modifyTrack = (req, res) => {
    if (req.session.userId == null)
        res.end()
    else {
        if (req.body.name == "" || req.body.code == "" || req.body.number == "")
        res.json({ error: "A mező nincs kitöltve!" })
        else {
            var db = new Database()
            db.modifyTrack(req, (result) => {
                res.json(result)
                db.end()
            })
        }
    }
}

exports.deleteTrack = (req, res) => {
    if (req.session.userId == null)
        res.end()
    else {
        var db = new Database()
        var bcrypt = new Bcrypt()
        db.passwordValidate(req, (result) => {
                bcrypt.decrypt(req.body.password, result[0].password, (hash) => {
                if (hash) {
                    db.deleteTrack(req)
                    res.json({ success: "Sikeres művelet!" })
                    db.end()
                } else {
                    res.json({ error: "Sikertelen művelet!" })
                    db.end()
                }
            })
        })
    }
}