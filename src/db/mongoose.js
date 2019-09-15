const mongoose = require('mongoose')
const validator = require('validator')

// connect to db instance; create new if not exists
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true, // creates indexes for data for convenience
  useUnifiedTopology: true // dunno, put it to remove warning
})

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
  }
})

// CREATE (insert) new document into collection
const task = new Task({
  
})

// // define field model for users collection
// // mongoose automatically creates collection with plural+lowercase name of model
// const User = mongoose.model('User', {
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     minlength: 7,
//     required: true,
//     trim: true,
//     validate(value) {
//       if (value.toLowerCase().includes('password')){
//         throw new Error('Error: password cannot contain "password"')
//       }
//     }
//   },
//   age: {
//     type: Number,
//     validate(value) {
//       if (value < 0) {
//         throw new Error('wtf mate!?')
//       }
//     },
//     default: 0
//   },
//   email: {
//     type: String,
//     required: true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error('Email is invalid')
//       }
//     },
//     trim: true,
//     lowercase: true
//   }
// })


// // CREATE a new instance of the document model
// const me = new User({
//   name: '   Jane  ',
//   email: 'mike@mikedomain.com   ',
//   password: 'bigpaswordokay'
// })


// INSERT the instance (document) to the collection
task.save().then(() => {
  console.log(task)
}).catch((err) => {
  console.log('Error: ', err)
})