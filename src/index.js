const express = require('express')
require('./db/mongoose')
const User = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // auto parse req json to object

/**
 * Tasks collections CRUD endpoints
 */

// create a new task
app.post('/tasks', (req, res) => {
  res.send('Great success!')
})

// retrieve all tasks
app.get('/tasks', (req, res) => {
  res.send('Great success!')
})

// retrieve a single task
app.get('/tasks/:id', (req, res) => {
  res.send('Great success!')
})

// update a task
app.patch('/tasks/:id', (req, res) => {
  res.send('Great success!')
})

//delete a task
app.delete('/tasks/:id', (req, res) => {
  res.send('Great success!')
})

/**
 * Users collections CRUD endpoints
 */

// create a new user
app.post('/users', (req, res) => {
  res.send('Great success!')
})

// retrieve all users
app.get('/users', (req, res) => {
  res.send('Great success!')
})

// retrieve a single user
app.get('/users/:id', (req, res) => {
  res.send('Great success!')
})

// update a user
app.patch('/users/:id', (req, res) => {
  res.send('Great success!')
})

//delete a user
app.delete('/users/:id', (req, res) => {
  res.send('Great success!')
})


app.listen(port, () => {
  console.log('Server is listening on port: ' + port)
})