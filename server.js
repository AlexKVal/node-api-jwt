'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const faker = require('faker')

const config = require('./config')
const User = require('./app/models/user')

const port = process.env.PORT || 8080

mongoose.connect(config.database)

const app = express()
app.set('jwtSecret', config.secret)
app.set('env', process.env.NODE_ENV || 'development')

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// routes
app.get('/', function(req, res) {
  res.send(`The API is at localhost:${port}/api`)
})

app.get('/setup', function(req, res) {
  const sampleUser = new User({
    name: 'Rember Johrdan',
    password: 'xpew!',
    admin: true
  })

  sampleUser.save((err) => {
    if (err) throw err

    console.log('Rember saved successfully')
    res.json({ success: true })
  })
})

// API
const api = express.Router()

// POST http://localhost:8080/api/authenticate
api.post('/authenticate', function(req, res) {
  const submittedName = req.body.name
  const submittedPassword = req.body.password

  User.findOne({ name: submittedName }, (err, user) => {
    if (err) throw err

    if (!user) {
      return res.json({ success: false, message: 'User not found' })
    }

    if (user.password !== submittedPassword) {
      return res.json({ success: false, message: 'Wrong password' })
    }

    const token = jwt.sign(user, app.get('jwtSecret'), { expiresInMinutes: 1440 }) // 24h

    return res.json({
      success: true,
      message: 'Token',
      token
    })
  })
})

// verify a token

// GET http://localhost:8080/api/
api.get('/', function(req, res) {
  res.json({ message: faker.company.catchPhrase() })
})

// GET http://localhost:8080/api/users
api.get('/users', function(req, res) {
  User.find({}, (err, users) => res.json(users))
})

app.use('/api', api)

app.listen(port, () => console.log(`The server listens on port ${port}`))
