require("dotenv").config()
const bcrypt = require("bcrypt")

// Database connectie
const { MongoClient, ServerApiVersion } = require("mongodb")
const uri =
    "mongodb+srv://" +
    process.env.DB_USERNAME +
    ":" +
    process.env.DB_PASS +
    "@" +
    process.env.DB_NAME +
    "." +
    process.env.DB_HOST
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
})
client.connect((err) => {
    if (err) {
        //throw err
        console.log(err)
    } else {
        console.log("Verbonden met de database")
    }
})

// Lokale packages activeren
const express = require("express")
const ejs = require("ejs")
const app = express()

app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT

// Static files
app.use(express.static("static"))

// Set view engine
app.set("view engine", ejs)
app.set("views", "view")

// Selecteer de juiste database en collectie
const db = client.db("legendTest")
const collection = db.collection("users")

// Routes
app.get("/", (req, res) => {
    res.send("Hello world!")
})

// Inloggen
app.get("/login", (req, res) => {
    res.render("login.ejs")
})

app.post("/profiel", async (req, res) => {
    const usernameCheck = await collection.findOne({
        username: req.body.username,
    })

    const errorMessage = "Gebruikersnaam of wachtwoord klopt niet"

    if (usernameCheck) {
        res.render("profiel.ejs", { username: req.body.username })
    } else {
        console.log("Gebruikersnaam of wachtwoord klopt niet")
        res.render("login.ejs", { errorMessage: errorMessage })
    }
})

// Registreren
app.get("/registreren", (req, res) => {
    res.render("registreren.ejs")
})

app.post("/succes", async (req, res) => {
    // Verkrijg informatie van invoervelden
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const hashesPassword = await bcrypt.hash(password, 10)

    // Zet die informatie in een object
    const user = {
        username,
        email,
        password: hashesPassword,
    }

    // Checken of de gebruikersnaam al in de database bestaat
    const usernameCheck = await collection.findOne({
        username: username,
    })

    const errorMessage =
        "Deze gebruikersnaam is niet beschikbaar. Kies een andere."

    if (usernameCheck) {
        console.log("Gebruikersnaam bestaat al")
        res.render("registreren.ejs", { errorMessage: errorMessage })
    } else {
        collection.insertOne(user)
        res.render("succes.ejs", { username: req.body.username })
    }
})

// Alle andere routes gaan hierheen
app.get("*", (req, res) => {
    res.send("Helaas, deze pagina bestaat niet. Hier een 404")
})

app.listen(port, () => {
    console.log("Port " + port + " is open")
})
