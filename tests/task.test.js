const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
  userOneId,
  userTwoId,
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
} = require('./fixtures/db')

// runs before each test
beforeEach(setupDatabase)

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks') // insert task in DB
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test'
    })
    .expect(201) // Assert res.status

  const task = await Task.findById(response.body._id) // DB query
  expect(task).not.toBeNull() // Assert DB insert worked
  expect(task.completed).toBe(false) // Assert default false was set
})

test('Should get tasks for only userOne', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200) // Assert res.status

  expect(response.body.length).toBe(2) // Assert got all tasks
})

test('Should not be able to delete task of other user', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404) // Assert res.status
  
  const task = Task.findById(taskOne._id) // DB query
  
  expect(task).not.toBe(null) // Assert task still in DB
})
