const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router() // create express router object

/**
 * Tasks collection CRUD endpoints
 */

// Create a new task document
router.post('/tasks', auth, async (req, res) => {
  // Create a new instance of the Task model
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    // INSERT the instance into the tasks collection
    await task.save()
    res.status(201).send(task) // respond with the task object
  } catch (e) {
    res.status(400).send(err)
  }
})

// Retrieve all tasks
router.get('/tasks', async (req, res) => {
  try {
    // SELECT all tasks from tasks collection
    const tasks = await Task.find({})
    res.send(tasks) // respond with an array of tasks
  } catch (e) {
    res.status(500).send(e)
  }
})

// Retrieve a single task by id
router.get('/tasks/:id', auth, async (req, res) => {
  // cache req param id
  const _id = req.params.id
  
  try {
    // SELECT a task from the tasks collection
    // WHERE task id matches req param and owner matches req user id
    const task = await Task.findOne({_id, owner: req.user._id})

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
router.patch('/tasks/:id', async (req, res) => {
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
    // SELECT task document by id and cache
    const task = await Task.findById(req.params.id)

    if (!task) {
      // no task with that ID found
      return res.status(404).send()
    }

    // modify cached document fields
    updates.map(update => {
      task[update] = req.body[update]
    })

    // UPDATE/SET modified task document in tasks collection
    task.save()

    res.send(task) // respond with the updated task object
  } catch (e) {
    res.status(400).send(e)
  }
})

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    //DELETE task document from the tasks collection
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      // no task with that ID found
      return res.status(404).send()
    }

    res.send(task) // Success; respond with the deleted task object
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
