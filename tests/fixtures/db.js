const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/user') // for access to static Model methods

// generate sample user Id
const userOneId = new mongoose.Types.ObjectId()

// generate sample user
const userOne = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@example.com',
  password: '56what!!!',
  // generate sample token
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
}

const setupDatabase = async () => {
  await User.deleteMany() // clear DB users collection
  await new User(userOne).save() // insert sample user in DB collection
}

module.exports = {
  userOneId,
  userOne,
  setupDatabase
}