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

    const token = jwt.sign(user, app.get('jwtSecret'), { expiresIn: 1440 * 60 }) // 24h

    return res.json({
      success: true,
      message: 'Token',
      token
    })
  })
})

// verify a token
// this middleware has to be beneath the "/api/authenticate" route
api.use(function(req, res, next) {
  // Authorization Bearer [0]
  const tokenAuthHeader = req.headers['authorization'] && req.headers['authorization'].match(/Bearer\s(\S+)/)[1]
  const tokenSent = req.body.token || req.headers['x-access-token'] || tokenAuthHeader

  if (!tokenSent) return res.status(403).send({success: false, message: 'No token provided'})

  jwt.verify(tokenSent, app.get('jwtSecret'), function(err, decoded) {
    if (err) return res.json({sucess: false, message: 'Failed to authenticate token'})

    req.decoded = decoded
    next()
  })
})

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
