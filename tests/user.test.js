const request = require('supertest') // for http request tests
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
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

// runs before each test
beforeEach(async () => {
  await User.deleteMany() // clear DB users collection
  await new User(userOne).save() // insert sample user
})

/**
 * Tests for user endpoints
 */

// Create new user
test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Andrew',
      email: 'andrew@example.com',
      password: 'MyPass777!'
    })
    .expect(201)
  
  // Assert that the DB was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Andrew',
      email: 'andrew@example.com'
    },
    token: user.tokens[0].token
  })

  // Assert plaintext PW not stored in DB
  expect(user.password).not.toBe('MyPass777!')
})

// Login existing user
test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200)
  
  const user = await User.findById(response.body.user._id)

  // Assert that the response token matches the user's next token
  expect(user.tokens[1].token).toBe(response.body.token)
})

// Login user: nonexistant email
test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'invalidemail@example.com',
      password: 'asdfqwer4321'
    })
    .expect(400)
})

// Get user profile
test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

// Get user profile, no auth token
test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

// Delete user account
test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  
  const user = await User.findById(userOneId)

  // Assert userOne no longer in DB after delete
  expect(user).toBeNull()
})

// Delete user account, no auth token
test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})
