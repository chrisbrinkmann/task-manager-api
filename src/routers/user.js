const express = require('express')
const User = require('../models/user')
const router = new express.Router() // create express router object

/**
 * Users collection CRUD endpoints
 */

// Create a new user document
router.post('/users', async (req, res) => {
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
router.get('/users', async (req, res) => {
  try {
    // SELECT all users from users collection
    const users = await User.find({})
    res.send(users) // respond with array of users
  } catch (e) {
    res.status(500).send(e)
  }
})

// Read a single user
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
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
    // SELECT user document instance by Id and cache
    const user = await User.findById(req.params.id)

    if (!user) {
      // no user with that ID found
      return res.status(404).send()
    }

    // modify cached document instance fields
    updates.map(update => {
      user[update] = req.body[update]
    })

    // UPDATE/SET modified instance in users collection
    await user.save()

    res.send(user) // Success; respond with the updated user object
  } catch (e) {
    res.status(400).send(e)
  }
})

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    // DELETE a user document from the users collection
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      // no user with that ID found
      return res.status(404).send()
    }

    res.send(user) // Success; respond with the deleted user object
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
