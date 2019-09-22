const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const cors = require('cors')

/**
 * Create the express server, mount middleware, routers, export.
 */

const app = express()

app.use(cors())
app.use(express.json()) // auto parse req json to object
app.use(userRouter) // register routers with app
app.use(taskRouter)

module.exports = app