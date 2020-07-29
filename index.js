require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

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
    Person.find({}).then( people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then( person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))/*{
        console.log(error)
        response.status(400).send({ error: 'malformed id'})
    })*/
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
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

    /* Name must be unique
    if (people.map(p => p.name).includes(body.name)) {
        return response.status(400).json({
            error: 'Name already exists in the phonebook'
        })
    }*/

    // Create new person
    const person = new Person({
        name: body.name,
        number: body.number
    })
    
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// Handle unknown endpoints
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformed id' })
    }

    next(error)
}

// Handle errors
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
