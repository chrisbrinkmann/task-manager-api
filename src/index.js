const express = require('express')

const app = express()
const port = process.env.PORT || 3000

// create a new task
app.post('/tasks', (req, res) => {
  res.send('Great success!')
})

// retrieve all tasks
app.get('/tasks', (req, res) => {
  res.send('Great success!')
})

// retrieve a single task
app.get('/tasks/:id', (req, res) => {
  res.send('Great success!')
})

// update a task
app.patch('/tasks/:id', (req, res) => {
  res.send('Great success!')
})

//delete a task
app.delete('/tasks/:id', (req, res) => {
  res.send('Great success!')
})



app.listen(port, () => {
  console.log('Server is listening on port: ' + port)
})