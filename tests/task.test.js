const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

// runs before each test
beforeEach(setupDatabase)

test('Should create task for user', () => {

})