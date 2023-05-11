const mongoose = require('mongoose')
const Sets = require('./sets')
const Minifigs = require('./minifigs')

const userSchema = new mongoose.Schema({
    name: {type: String, required: true}, 
    email: {type: String, required: true, unique: true }, 
    username: {type: String, required: true}, 
    password: {type: String, required: true}, 
    listOfSets: [Sets.schema],
    listOfMinifigs: [Minifigs.schema]
})

const User = mongoose.model('User', userSchema)
module.exports = User