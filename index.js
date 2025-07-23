const express = require('express')
require('dotenv').config()
const Note = require('./models/note')


const app = express()
app.use(express.static('dist'))
const cors = require('cors')

app.use(cors())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(express.json())
app.use(requestLogger)
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;
  return String(maxId + 1)
}
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/notes', (request, response) => {
  Note.find({})
    .then(notes => {
      console.log('Fetched from DB:', notes)
      response.json(notes)
    })
    .catch(error => {
      console.error('Error fetching notes:', error)
      response.status(500).json({ error: 'DB query failed' })
    })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})