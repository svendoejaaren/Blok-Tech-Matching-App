require('dotenv').config()

// Database connectie
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASS + "@" + process.env.DB_NAME + 
            "." + process.env.DB_HOST
// + "/?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
client.connect(err => {
    if (err) {
        //throw err
        console.log(err)
    } else {
        console.log("Verbonden met de database")
    }
})

// Lokale packages activeren
const express = require('express')
const ejs = require('ejs')
const app = express()
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const userSchema = require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT

// Static files
app.use(express.static('static'))

app.use(passport.initialize())
//app.use(passport.session())

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
    res.render('registreren.ejs')
})

app.post('/succes', (req, res) => {
    const { username, email, password } = req.body
    //const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = {
        username,
        email,
        password
    }

    console.log('tot hier');

    const mongo = new MongoClient(uri, { useNewUrlParser: true })

    mongo.connect(async (err) => {

        try {
            console.log('kaas');
            const db = mongo.db('legendTest')
            const collection = db.collection('users')
            console.log(collection)
            await collection.insertOne(user)
            mongo.close()
            res.redirect('/succes')
        } catch(error) {
            console.log(error);
        }
    })
})

app.get('/succes', (req, res) => {
    res.send('Je bent geregistreerd!')
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