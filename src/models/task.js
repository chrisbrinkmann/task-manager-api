const mongoose = require('mongoose')
const validator = require('validator')

// define field model for tasks collection (table)
// mongoose automatically creates collection with plural+lowercase name of model
const Task = mongoose.model('Task', {
  description: {
    type: String,
    trim: true,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

module.exports = Task