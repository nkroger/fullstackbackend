const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Mongoose
//const url = `mongodb+srv://fullstack:${password}@cluster0.cmmmf.mongodb.net/test?retryWrites=true&w=majority`
const url = process.env.MONGODB_URI
mongoose.set('useCreateIndex', true)

console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    console.log('connected to MongoDB')
  )
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Mongo schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true },
  number: {
    type: String,
    minlength: 8,
    required: true }
})
personSchema.plugin(uniqueValidator)
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)