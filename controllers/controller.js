var Database = require("../models/Database")
var Bcrypt = require("../models/Bcrypt")

exports.login = (req, res) => {
    if (req.body.username == "" || req.body.password == "")
        res.json({ error: "Something is missing!" })
    else {
        var db = new Database()
        var bcrypt = new Bcrypt()
        db.login(req, (result) => {
            if (result.length == 0) {
                res.json({ error: "Login is unsuccessful" })
                db.end()
            } else {
                bcrypt.decrypt(req.body.password, result[0].password, (hash) => {
                    if (hash) {
                        req.session.userId = result[0].id
                        res.json({ success: "" })
                        db.end()
                    } else {
                        res.statusCode = 401
                        res.json({ error: "Login is unsuccessful" })
                        db.end()
                    }
                })
            }
        })
    }
}

exports.session = (req, res) => {
    if (req.session.userId == undefined)
        res.json({ error: "" })
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

exports.getAllSeason = (req, res) => {
    var db = new Database()
    db.getAllSeason(req, (result) => {
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

exports.modifySeason = (req, res) => {
    if (req.body.name == "")
        res.json({ error: "A mező nincs kitöltve!" })
    else {
        var db = new Database()
        db.modifySeason(req)
        res.json({ success: "" })
        db.end()
    }
    db.modifySession(req)
}