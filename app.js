var express = require("express")
var app = express()
var session = require("express-session")
var bodyParser = require("body-parser")
var router = require("./router")
var cors = require("cors")
var parameter = require("./parameter.json")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({credentials: true, origin: "http://localhost"}))
app.use(session({
    name: "session",
    secret: "secret",
    saveUninitialized: true,
    resave: true,
    unset: 'destroy',
    cookie: {
        maxAge: null
    }
}))

app.use("/", router)

app.listen(parameter.app.port, () => {
    console.log(`Server is running on port ${parameter.app.port}`)
})