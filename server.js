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

app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT

// Static files
app.use(express.static('static'))

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

app.post('/profiel', async (req, res) => {
  const username = req.body.username

  const db = client.db('legendTest')
  const collection = db.collection('users')

  result = await collection.findOne({
    username: username,
  })

  console.log(result.username)

  // if result = ga naar profiel pagina
  // else blijf op login pagina met foutmelding
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

  res.render('succes.ejs', { username: req.body.username })
})

// Alle andere routes gaan hierheen
app.get('*', (req, res) => {
  res.send('Helaas, deze pagina bestaat niet. Hier een 404')
})

app.listen(port, () => {
  console.log('Port ' + port + ' is open')
})
