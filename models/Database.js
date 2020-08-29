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

    generateNewHashedId(table) {
        this.hashedId = require("crypto").randomBytes(10).toString("hex")
        var sql = `SELECT COUNT(*) AS count FROM ${table} WHERE id = "${this.hashedId}"`
        this.conn.query(sql, (err, result) => {
            if (err) throw err
            else if (result[0].count == 1) this.generateNewHashedId(table);
        })
    }
    
    end() {
        this.conn.end()
    }
}
module.exports = Database