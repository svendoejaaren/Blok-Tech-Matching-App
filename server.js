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
const LocalStrategy = require('passport-local')
const userSchema = require('./models/user')
const session = require('express-session')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT

// Static files
app.use(express.static('static'))

// passport opzetten
app.use(passport.initialize())
// app.use(passport.session())

// passport.use(new LocalStrategy(
//     function(username, password, done) {
//         userSchema.findOne({username: username }, function(error, user) {
//             if (error) {
//                 return done(error)
//             }
//             if (!user) {
//                 return done(null, false, { message: 'Gebruiker niet gevonden'})
//             }
//             if (!user.verifyPassword(password)) {
//                 return done(null, false, { message: 'Wachtwoord klopt niet' })
//             }
//             return done(null, user)
//         })
//     }
// ))
// passport.serializeUser(userSchema.serializeUser)
// passport.deserializeUser(userSchema.deserializeUser)

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

// Inloggen afhandelen en kijken of gegevens matchen vanuit de database
// app.post("/login", async (req, res) => {
//     try {
//         const user = await userSchema.findOne({ username: req.body.username })
//         if (user) {
//             const result = req.body.password === user.password
//             if (result) {
//                 res.render("profiel")
//             } else {
//                 res.status(400).json({ error: "Onjuiste wachtwoord" })
//             }
//         } else {
//             res.status(400).json({ error: "Gebruikersnaam klopt niet" })
//         }
//     } catch (error) {
//         res.status(400).json({ error })
//     }
// })

// app.get("/profiel", isLoggedIn, (req, res) => {
//     res.render("profiel.ejs")
// })

app.get('/registreren', (req, res) => {
    res.render('registreren.ejs')
})

app.post('/succes', (req, res) => {
    const { username, email, password } = req.body

    const user = {
        username,
        email,
        password
    }

    console.log('tot hier')

    try {
        console.log('kaas')
        const db = client.db('legendTest')
        const collection = db.collection('users')
        collection.insertOne(user)
        res.render('succes.ejs')
    } catch(error) {
        console.log(error)
    }
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