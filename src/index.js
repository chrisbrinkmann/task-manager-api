const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // auto parse req json to object

/**
 * Tasks collection CRUD endpoints
 */

// Create a new task document
app.post('/tasks', async (req, res) => {
  // Create a new instance of the Task model
  const task = new Task(req.body)

  try {
    // INSERT the instance into the tasks collection
    await task.save()
    res.status(201).send(task) // respond with the task object
  } catch (e) {
    res.status(400).send(err)
  }
})

// Retrieve all tasks
app.get('/tasks', async (req, res) => {
  try {
    // SELECT all tasks from tasks collection
    const tasks = await Task.find({})
    res.send(tasks) // respond with an array of tasks
  } catch (e) {
    res.status(500).send(e)
  }
})

// Retrieve a single task
app.get('/tasks/:id', async (req, res) => {
  try {
    // SELECT a task from the tasks collection
    const task = await Task.findById(req.params.id)

    if (!task) {
      // no task with that ID found
      return res.status(404).send()
    }
    res.send(task) // respond with the task object
  } catch (e) {
    res.status(500).send(e)
  }
})

// Update a task
app.patch('/tasks/:id', async (req, res) => {
  // only allow updates to certain fields
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    // UPDATE/SET field(s) for task document in tasks collection
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!task) {
      // no task with that ID found
      return res.status(404).send()
    }

    res.send(task) // respond with the updated task object
  } catch (e) {
    res.status(400).send(e)
  }
})

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  res.send('Great success!')
})

/**
 * Users collection CRUD endpoints
 */

// Create a new user document
app.post('/users', async (req, res) => {
  // Create a new instance of the document model
  const user = new User(req.body)

  try {
    // INSERT the document instance into the collection
    await user.save()
    res.status(201).send(user) // respond with user object
  } catch (e) {
    res.status(400).send(err)
  }
})

// Read all users
app.get('/users', async (req, res) => {
  try {
    // SELECT all users from users collection
    const users = await User.find({})
    res.send(users) // respond with array of users
  } catch (e) {
    res.status(500).send(e)
  }
})

// Read a single user
app.get('/users/:id', async (req, res) => {
  try {
    // SELECT a user from users collection
    const user = await User.findById(req.params.id)
    if (!user) {
      // no user with that ID found
      return res.status(404).send()
    }
    res.send(user) // respond with the user object
  } catch (e) {
    res.status(500).send(e)
  }
})

// Update a user
app.patch('/users/:id', async (req, res) => {
  // only allow certain updates to certain fields
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    // UPDATE/SET field(s) for user document in users collection
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!user) {
      // no user with that ID found
      return res.status(404).send()
    }

    res.send(user) // Success; respond with the updated user object
  } catch (e) {
    res.status(400).send(e)
  }
})

// Delete a user
app.delete('/users/:id', (req, res) => {
  res.send('Great success!')
})

app.listen(port, () => {
  console.log('Server is listening on port: ' + port)
})
