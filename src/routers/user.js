const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router() // create express router object

/**
 * Users collection CRUD endpoints
 */

// Create a new user document - "sign up"
router.post('/users', async (req, res) => {
  // Create a new instance of the document model
  const user = new User(req.body)

  try {
    // create user JWT (also saves user instance to collection)
    const token = await user.generateAuthToken()

    res.status(201).send({ user, token }) // respond with user object
  } catch (e) {
    res.status(400).send(e)
  }
})

// Log in a user
router.post('/users/login', async (req, res) => {
  try {
    // SELECT user document by email and password and cache
    const user = await User.findByCredentials(req.body.email, req.body.password)

    // create user JWT (also saves user instance to collection)
    const token = await user.generateAuthToken()

    res.send({ user, token }) // respond with the user object, JWT
  } catch (e) {
    res.status(400).send(e)
  }
})

// Log out a user
router.post('/users/logout', auth, async (req, res) => {
  try {
    // loop over all current user tokens
    req.user.tokens = req.user.tokens.filter(token => {
      // remove only the user token matching request token
      return token.token !== req.token
    })
    // save updated user document to the db
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// Read current user profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
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
    // SELECT user document by Id and cache
    const user = await User.findById(req.params.id)

    if (!user) {
      // no user with that ID found
      return res.status(404).send()
    }

    // modify cached document fields
    updates.map(update => {
      user[update] = req.body[update]
    })

    // UPDATE/SET modified document in users collection
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
