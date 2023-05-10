const mongoose = require('mongoose')
const bcrypt = require ('bcrypt')

const userSchema = new mongoose.Schema({
    name: {type: String, required: true}, 
    email: {type: String, required: true, unique: true }, 
    username: {type: String, required: true}, 
    password: {type: String, required: true}, 
    listOfSets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SetList'
    }]
})

userSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(this.password, salt)
        this.password = passwordHash
        next()
    } catch (error) {
        next(error)
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User