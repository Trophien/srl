var parameter = require("../parameter.json")
class Database {
    constructor() {
        var mysql = require("mysql")
        this.conn = mysql.createConnection({
            host: parameter.db.host,
            user: parameter.db.user,
            password: parameter.db.password,
            database: parameter.db.database
        })
        this.hashedId = ""
    }

    passwordValidate(req, callback) {
        var sql = `SELECT password FROM user WHERE id = "${req.session.userId}"`
        this.conn.query(sql, (err, result) => {
            return callback(result)
        })
    }

    login(req, callback) {
        var sql = `SELECT id, password FROM user WHERE username = "${req.body.username}"`
        this.conn.query(sql, (err, result) => {
            return callback(result)
        })
    }

    generateNewHashedId(table) {
        this.hashedId = require("crypto").randomBytes(10).toString("hex")
        var sql = `SELECT COUNT(*) AS count FROM ${table} WHERE id = "${this.hashedId}"`
        this.conn.query(sql, (err, result) => {
            if (err) throw err
            else if (result[0].count == 1) this.generateNewHashedId(table);
        })
    }

    getNotArchivedSeason(req, callback) {
        var sql = `SELECT * FROM season WHERE archived = 0`
        this.conn.query(sql, (err, result) => {
            return callback(result)
        })
    }

    getRacerPoint(req, callback) {
        var sql = `
            SELECT r.name, te.name AS team, sum(point) AS point
            FROM season_track_racer str
            LEFT JOIN season_track st ON season_track_id = st.id
            LEFT JOIN track tr ON st.track_id = tr.id
            LEFT JOIN season s ON st.season_id = s.id
            LEFT JOIN racer r ON str.racer_id = r.id
            LEFT JOIN team te ON r.team_id = te.id
            WHERE s.id = "${req.body.seasonId}"
            GROUP BY str.racer_id
            ORDER BY sum(point) DESC`
        this.conn.query(sql, (err, result) => {
            return callback(result)
        })
    }

    getTeamPoint(req, callback) {
        var sql = `
            SELECT t.name AS team, sum(point) AS point
            FROM season_track_racer str
            LEFT JOIN racer r ON str.racer_id = r.id
            LEFT JOIN team t ON r.team_id = t.id
            LEFT JOIN season_track st ON str.season_track_id = st.id
            LEFT JOIN season s ON st.season_id = s.id
            WHERE s.id = "${req.body.seasonId}"
            GROUP BY t.id
            ORDER BY sum(point) DESC`
        this.conn.query(sql, (err, result) => {
            return callback(result)
        })
    }
    
    // admin
    getAllSeason(req, callback) {
        var sql = `SELECT * FROM season`
        this.conn.query(sql, (err, result) => {
            return callback(result)
        })
    }

    getOneSeason(req, callback) {
        var sql = `SELECT * FROM season WHERE id = "${req.params.id}"`
        this.conn.query(sql, (err, result) => {
            return callback(result[0])
        })
    }

    addSeason(req, callback) {
        this.generateNewHashedId(`season`)
        var sql = `INSERT INTO season (id, name) VALUES ("${this.hashedId}", "${req.body.name}")`
        this.conn.query(sql, (err) => {
            if (err)
                return callback({ error: "Ez a szezon már létezik!" })
            return callback({ success: "Sikeres művelet!" })
        })
    }

    modifySeason(req, callback) {
        var sql = `UPDATE season SET name = "${req.body.name}" WHERE id = "${req.params.id}"`
        this.conn.query(sql, (err) => {
            if (err)
                return callback({ error: "Ez a szezon már létezik!" })
            return callback({ success: "Sikeres művelet!" })
        })
    }

    modifySeasonArchived(req) {
        var sql = `UPDATE season SET archived = ${req.body.archived} WHERE id = "${req.params.id}"`
        this.conn.query(sql)
    }

    deleteSeason(req) {
        var sql = `DELETE FROM season WHERE id = "${req.params.id}"`
        this.conn.query(sql)
    }

    // tracks

    getAllTrack(req, callback) {
        var sql = `SELECT * FROM season_track WHERE season_id = "${req.params.seasonId}" ORDER BY number ASC`
        this.conn.query(sql, (err, result) => {
            return callback(result)
        })
    }

    getOneTrack(req, callback) {
        var sql = `SELECT * FROM season_track WHERE id = "${req.params.id}"`
        this.conn.query(sql, (err, result) => {
            return callback(result[0])
        })
    }

    addTrack(req, callback) {
        this.generateNewHashedId(`season_track`)
        var sql = `INSERT INTO season_track (id, season_id, number, code, name) VALUES ("${this.hashedId}", "${req.body.seasonId}", ${req.body.number},"${req.body.code}", "${req.body.name}")`
        this.conn.query(sql, (err) => {
            if (err)
                return callback({ error: "Az adatoknak egyedieknek kell lenniük!" })
            return callback({ success: "Sikeres művelet!" })
        })
    }

    modifyTrack(req, callback) {
        var sql = `UPDATE season_track SET number = "${req.body.number}", code = "${req.body.code}", name = "${req.body.name}" WHERE id = "${req.params.id}"`
        this.conn.query(sql, (err) => {
            if (err)
                return callback({ error: "Az adatoknak egyedieknek kell lenniük!" })
            return callback({ success: "Sikeres művelet!" })
        })
    }

    deleteTrack(req) {
        var sql = `DELETE FROM season_track WHERE id = "${req.params.id}"`
        this.conn.query(sql)
    }

    end() {
        this.conn.end()
    }
}
module.exports = Database