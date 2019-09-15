const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // auto parse req json to object

/**
 * Tasks collections CRUD endpoints
 */

// Create a new task
app.post('/tasks', (req, res) => {
  // Create a new instance of the Task model
  const task = new Task(req.body)

  // INSERT the instance into the tasks collection
  task
    .save()
    .then(() => {
      // respond with task
      res.status(201).send(task)
    })
    .catch(err => {
      res.status(400).send(err)
    })
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

// Create a new user
app.post('/users', (req, res) => {
  // Create a new instance of the document model
  const user = new User(req.body)

  // INSERT the instance (document) to the collection
  user
    .save()
    // respond with user
    .then(() => {
      res.status(201).send(user)
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

// Read all users
app.get('/users', (req, res) => {
  // SELECT users from from User collection
  User.find({})
    .then(users => {
      // respond with the user
      res.send(users)
    })
    .catch(e => {
      res.status(500).send(e)
    })
})

// Read a single user
app.get('/users/:id', (req, res) => {
    // SELECT users from from User collection
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        // no user with that ID found
        res.status(404).send()
      }
      // respond with the user
      res.send(user)
    })
    .catch(e => {
      res.status(500).send(e)
    })
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
