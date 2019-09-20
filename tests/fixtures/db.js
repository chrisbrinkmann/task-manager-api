const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user') // for access to static Model methods
const Task = require('../../src/models/task')

// generate sample user Id + user
const userOneId = new mongoose.Types.ObjectId()
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

// generate 2nd sample userID + user
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: 'Joni Stubbs',
  email: 'jstubbs@example.com',
  password: 'myhousepc77!!!',
  // generate sample token
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
}

// generate sample tasks
const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOne._id
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: '2nd task',
  completed: true,
  owner: userOne._id
}

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: '3rd task',
  completed: true,
  owner: userTwo._id
}

const setupDatabase = async () => {
  await User.deleteMany() // clear DB users collection
  await Task.deleteMany() // clear DB tasks collection
  await new User(userOne).save() // insert sample user in DB collection
  await new User(userTwo).save() // ...
  await new Task(taskOne).save() // insert sample task in DB collection
  await new Task(taskTwo).save() // ...
  await new Task(taskThree).save() // ...
}

module.exports = {
  userOneId,
  userOne,
  setupDatabase
}