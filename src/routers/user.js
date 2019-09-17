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

// Log out a user from current session
router.post('/users/logout', auth, async (req, res) => {
  try {
    // loop over all current user tokens
    req.user.tokens = req.user.tokens.filter(token => {
      // remove only the user token matching request token
      // note each user token has a token prop (token.token)
      return token.token !== req.token
    })
    // save updated user document to the db
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// Log out a user from all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    // wipe all current user tokens
    req.user.tokens = []

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

// Update a user
router.patch('/users/me', auth, async (req, res) => {
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
    // modify current user fields
    updates.map(update => {
      req.user[update] = req.body[update]
    })

    // UPDATE/SET modified document in users collection
    await req.user.save()

    res.send(req.user) // Success; respond with the updated user object
  } catch (e) {
    res.status(400).send(e)
  }
})

// Delete a user
router.delete('/users/me', auth, async (req, res) => {
  try {
    // DELETE a user document from the users collection
    await User.deleteOne({_id: req.user._id})

    res.send(req.user) // Success; respond with the deleted user object
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
