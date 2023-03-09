require('dotenv').config()

// Database connectie
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST + 
            "." + process.env.DB_NAME + "/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    if (err) {
        throw err
    } else {
        console.log("Verbonden met de database")
    }
});

// Lokale packages activeren
const express = require('express')
const ejs = require('ejs')
const app = express()

const port = process.env.PORT

// Static files
app.use(express.static('static'))

// Set view engine
app.set('view engine', ejs)
app.set('views', 'view')

// Routes
app.get('/', (req, res) => {
    res.send("Hello world!")
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/registreren', (req, res) => {
    res.render('registreer.ejs')
})

app.get('/profiel/:user', (req, res) => {
    res.send("Hallo " + req.params.user + "! Welkom")
})

// Alle andere routes gaan hierheen
app.get('*', (req, res) => {
    res.send("Helaas, deze pagina bestaat niet. Hier een 404")
})

app.listen(port, () => {
    console.log("Port " + port + " is open")
})