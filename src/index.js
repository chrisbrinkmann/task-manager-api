const app = require('./app')
const cookieParser = require('cookie-parser')
const port = process.env.PORT

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false })) // parses data sent via forms from frontend
app.use(cookieParser) // parses cookies sent with forms

/**
 * Start server
 */
app.listen(port, () => {
  console.log('Server is listening on port: ' + port)
})
