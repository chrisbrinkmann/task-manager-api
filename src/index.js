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

// Retrieve all tasks
app.get('/tasks', (req, res) => {
  // SELECT tasks from from Tasks collection
  Task.find({})
    .then(tasks => {
      // respond with the tasks
      res.send(tasks)
    })
    .catch(e => {
      res.status(500).send(e)
    })
})

// Retrieve a single task
app.get('/tasks/:id', (req, res) => {
  // SELECT task from from Task collection
  Task.findById(req.params.id)
    .then(task => {
      if (!task) {
        // no task with that ID found
        res.status(404).send()
      }
      // respond with the task
      res.send(task)
    })
    .catch(e => {
      res.status(500).send(e)
    })
})

// Update a task
app.patch('/tasks/:id', (req, res) => {
  res.send('Great success!')
})

// Delete a task
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
  // SELECT users from from Users collection
  User.find({})
    .then(users => {
      // respond with the users
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

// Update a user
app.patch('/users/:id', (req, res) => {
  res.send('Great success!')
})

// Delete a user
app.delete('/users/:id', (req, res) => {
  res.send('Great success!')
})

app.listen(port, () => {
  console.log('Server is listening on port: ' + port)
})
