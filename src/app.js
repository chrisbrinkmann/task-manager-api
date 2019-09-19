const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

/**
 * Create the express server, mount middleware, routers, export.
 */

const app = express()

app.use(express.json()) // auto parse req json to object
app.use(userRouter) // register routers with app
app.use(taskRouter)

module.exports = app