const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../emails/account')
const router = new express.Router() // create express router object

/**
 * Users collection CRUD endpoints
 */

// Create a new user document - "sign up"
router.post('/users', async (req, res) => {
  // Create a new instance of the document model
  const user = new User(req.body)

  try {
    // create user JWT (also saves [INSERT/UPDATE] user instance to collection)
    const token = await user.generateAuthToken()

    // send user a welcome email
    sendWelcomeEmail(user.email, user.name)

    res.status(201).send({ user, token }) // respond with user object
  } catch (e) {
    res.status(400).send(e)
  }
})

// set upload options for upload profile image route
const upload = multer({
  limits: {
    fileSize: 1000000 // 1MB
  },
  fileFilter(req, file, cb) {
    // only allow jpg, jpeg, or png uploads
    if (!file.originalname.match(/\.(jpe?g|png)$/i)) {
      cb(new Error('Upload must be jpg, jpeg, or png type.'))
    }

    cb(undefined, true) // accept upload
  }
})

// Upload a user profile image
router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    // multer provides access to uploaded img thru req.file.buffer
    // use sharp to resize and convert the uploaded img to png
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer()

    // assign modified img buffer to user
    req.user.avatar = buffer

    // UPDATE.SET modified user document to the collection
    await req.user.save()

    res.send()
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message })
  }
)

// Log in a user
router.post('/users/login', async (req, res) => {
  try {
    // SELECT user document by email and password and cache
    const user = await User.findByCredentials(req.body.email, req.body.password)

    // create user JWT (also saves [INSERT/UPDATE] user instance to collection)
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

// Read user avatar image
router.get('/users/:id/avatar', async (req, res) => {
  try {
    // SELECT user from collection WHERE _id = req id param
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
      // user or avatar not found
      throw new Error('Requested data not found.')
    }

    // success; set content type and respond with user's avatar image
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send(e)
  }
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
    // also triggers middleware which deletes all of that user's tasks
    await User.findOneAndDelete({ _id: req.user._id })

    res.send(req.user) // Success; respond with the deleted user object
  } catch (e) {
    res.status(500).send(e)
  }
})

// Delete a user's avatar image
router.delete('/users/me/avatar', auth, async (req, res) => {
  // modify current user avatar
  req.user.avatar = undefined
  try {
    // UPDATE/SET document to the collection
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router
