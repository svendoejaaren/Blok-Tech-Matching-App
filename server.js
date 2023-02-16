const express = require('express')
const app = express()

const port = 3000

// Static files
app.use(express.static('static'))

// Routes
app.get('/', (req, res) => {
    res.send("Hello world!")
})

app.get('/login', (req, res) => {
    res.send("Log in")
})

app.get('/registreren', (req, res) => {
    res.send("Registreren")
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