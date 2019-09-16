const mongoose = require('mongoose')

// connect to db instance; create new if not exists
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true, // creates indexes for data for convenience
  useUnifiedTopology: true, // dunno, put it to remove warning
  useFindAndModify: false // deprecated
})