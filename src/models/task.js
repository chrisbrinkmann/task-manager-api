const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
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
},
{
  timestamps: true
})

// define field model for tasks collection (table)
// mongoose automatically creates collection with plural+lowercase name of model
const Task = mongoose.model('Task', taskSchema)

module.exports = Task
