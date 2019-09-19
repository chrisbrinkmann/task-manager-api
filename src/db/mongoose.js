const mongoose = require('mongoose')

// connect to db instance; create new if not exists
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true, // creates indexes for data for convenience
  useUnifiedTopology: true, // dunno, put it to remove warning
  useFindAndModify: false // deprecated
})