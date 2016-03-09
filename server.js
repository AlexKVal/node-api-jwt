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

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(morgan('dev'))

// routes
app.get('/', function(req, res) {
  res.send(`The API is at localhost:${port}/api`)
})

// API



app.listen(port, () => console.log(`The server listens on port ${port}`))
