require('dotenv').config()

// Database connectie
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri =
  'mongodb+srv://' +
  process.env.DB_USERNAME +
  ':' +
  process.env.DB_PASS +
  '@' +
  process.env.DB_NAME +
  '.' +
  process.env.DB_HOST
// + "/?retryWrites=true&w=majority"
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
    console.log('Verbonden met de database')
  }
})

// Lokale packages activeren
const express = require('express')
const ejs = require('ejs')
const app = express()
// const bodyParser = require('body-parser')
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const userSchema = require("./models/user");
// const session = require("express-session");

app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.json());

const port = process.env.PORT

// Static files
app.use(express.static('static'))

// passport opzetten
// app.use(passport.initialize());
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
  res.send('Hello world!')
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.get('/registreren', (req, res) => {
  res.render('registreren.ejs')
})

app.post('/succes', (req, res) => {
  // Verkrijg informatie van invoervelden
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  // Zet die informatie in een object
  const user = {
    username,
    email,
    password,
  }

  // De juiste collectie in de database selecteren en daar informatie van het formulier inzetten
  const db = client.db('legendTest')
  const collection = db.collection('users')
  collection.insertOne(user) // hiervoor hebben we de gegevens van het registreerformulier in een object gezet

  res.render('succes.ejs')
})

app.get('/succes', (req, res) => {
  res.send('Je bent geregistreerd!')
})

app.get('/profiel/:user', (req, res) => {
  res.send('Hallo ' + req.params.user + '! Welkom')
})

// Alle andere routes gaan hierheen
app.get('*', (req, res) => {
  res.send('Helaas, deze pagina bestaat niet. Hier een 404')
})

app.listen(port, () => {
  console.log('Port ' + port + ' is open')
})
