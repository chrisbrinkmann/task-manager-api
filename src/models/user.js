const mongoose = require('mongoose')
const validator = require('validator')

// define field model for users collection
// mongoose automatically creates collection with plural+lowercase name of model
const User = mongoose.model('User', {
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
      if (value.toLowerCase().includes('password')){
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
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    },
    trim: true,
    lowercase: true
  }
})

module.exports = User
