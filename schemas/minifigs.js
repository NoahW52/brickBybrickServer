const mongoose = require('mongoose')

const minifigSchema = new mongoose.Schema({
    name: {type: String, required: true},
    set_img_url: {type: String, required: true}
})

const minifigList = mongoose.model('minifigs', minifigSchema)
module.exports = minifigList