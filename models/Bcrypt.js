class Bcrypt {
    constructor() {
        this.bcrypt = require("bcrypt")
        this.saltRounds = 10;
    }

    encrypt(password, callback) {
        this.bcrypt.hash(password, this.saltRounds, (err, hash) => {
            return callback(hash)
        })
    }

    decrypt(password, hash, callback) {
        this.bcrypt.compare(password, hash, (err, result) => {
            return callback(result)
        })
    }
}

module.exports = Bcrypt