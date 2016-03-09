const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

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

// API
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


app.listen(port, () => console.log(`The server listens on port ${port}`))
