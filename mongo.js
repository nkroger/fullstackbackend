// Testing MongoDB(Atlas) and Mongoose
const mongoose = require('mongoose')

const args = process.argv.length

if (args < 3) {
    console.log('Please pass the password as an argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.cmmmf.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)


if (args == 3) {
    Person.find({}).then( result => {
        console.log('Phonebook:')
        result.forEach( person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else if (args > 4) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(response => {
        console.log(`Added ${response.name}, number ${response.number} to phonebook.`)
        mongoose.connection.close()
    })
} else {
    console.log('Please enter a name and number')
    mongoose.connection.close()
}