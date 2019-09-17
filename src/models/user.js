const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

// cache db collection schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 7,
    required: true,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Error: password cannot contain "password"')
      }
    }
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error('Age cannot be less than 0.')
      }
    },
    default: 0
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    },
    trim: true,
    lowercase: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

/**
 * Virtual fields
 */

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

/**
 * Model Methods
 */

// returns user document for given email and password combo
userSchema.statics.findByCredentials = async (email, password) => {
  // SELECT the user document by email
  const user = await User.findOne({ email })

  if (!user) {
    // no user with that email found
    throw new Error('Unable to log in')
  }

  // compare given password with document password
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    // passwords don't match
    throw new Error('Unable to log in')
  }

  // email and passwords match, return user document
  return user
}

/**
 * Instance Methods
 */

// Generate and return a JWT for a user
userSchema.methods.generateAuthToken = async function () {
  const user = this

  // generate JWT from user's id and secret
  const token = jwt.sign({ _id: user._id.toString()}, 'fitwindsam')
  
  // Add JWT to user's props
  user.tokens = user.tokens.concat({ token })

  // INSERT/UPDATE user document to users collection
  await user.save()

  return token
}

// Hide user password and token props
// triggered whenever instance of user is passed to JSON.stringify (res.send())
userSchema.methods.toJSON = function () {
  const user = this
  
  // returns raw object stripped of mongoose innate props
  const userObject = user.toObject()

  // remove sensitive data
  delete userObject.password
  delete userObject.tokens

  // return modified user JSON
  return userObject
}

/**
 * Middleware (document)
 */

// Encrypt user password; runs before any call to user.save()
userSchema.pre('save', async function (next) {
  const user = this // for readability; this = document calling .save()

  // if password field is created of modified
  if (user.isModified('password')) {
    // encrypt the pw
    user.password = await bcrypt.hash(user.password, 9)
  }

  next() // calls the next middlware in lexical order
})

// Delete tasks of deleted user; runs before any call of user.remove()
userSchema.pre('remove', async function (next) {
  const user = this // the document calling .remove()

  // DELETE any tasks WHERE owner === user._id
  Task.deleteMany({ owner: user._id })

  next()
})

// define field model for users collection
// mongoose automatically creates collection with plural+lowercase name of model
const User = mongoose.model('User', userSchema)

module.exports = User
