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
  await new User(userOne).save() // insert sample user in DB collection
})

/**
 * Tests for user endpoints
 */

// Create new user
test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users') // insert to DB 
    .send({
      name: 'Andrew',
      email: 'andrew@example.com',
      password: 'MyPass777!'
    })
    .expect(201) // Assert res.status
  
  // Assert that the DB was changed correctly
  const user = await User.findById(response.body.user._id) // DB query
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
    .post('/users/login') // update to DB (user.tokens)
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200) // Assert res.status
  
  const user = await User.findById(response.body.user._id) // DB query

  // Assert that the response token matches the user's next token
  expect(user.tokens[1].token).toBe(response.body.token)
})

// Login user: nonexistant email
test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login') // update to DB (user.tokens)
    .send({
      email: 'invalidemail@example.com',
      password: 'asdfqwer4321'
    })
    .expect(400) // Assert res.status
})

// Get user profile
test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me') // select from DB
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200) // Assert res.status
})

// Get user profile, no auth token
test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me') // select from DB
    .send()
    .expect(401) // Assert res.status
})

// Delete user account
test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me') // delete from DB
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200) // Assert res.status
  
  const user = await User.findById(userOneId) // DB query 

  // Assert userOne no longer in DB after delete
  expect(user).toBeNull()
})

// Delete user account, no auth token
test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me') // delete from DB
    .send()
    .expect(401) // Assert res.status
})
