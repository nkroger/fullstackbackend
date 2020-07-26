const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())

app.use(express.json())
app.use(express.static('build'))

morgan.token('post-body', (req, res) => {
    if (req.method == 'POST') {
        return JSON.stringify(req.body).concat(' -')
    } else {
        return '-'
    }
})

app.use(morgan(':method :url :status :res[content-length] :post-body :response-time ms'))

const PORT = process.env.PORT || 3001

let people = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 999999)
}


app.get('/info', (request, response) => {
    const date = new Date()
    const size = people.length
    const content = `
        <div>
            <p>This phonebook has info for ${size} people</p>
            <p>${date}</p>
        </div>`
    response.send(content)
})


app.get('/api/persons', (request, response) => {
    response.json(people)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = people.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    people = people.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    // Must have name and nubmer
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    // Name must be unique
    if (people.map(p => p.name).includes(body.name)) {
        return response.status(400).json({
            error: 'Name already exists in the phonebook'
        })
    }

    // Create new person
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    people = people.concat(person)

    response.json(person)
})


app.listen(PORT)
console.log(`Server running on port ${PORT}`)
