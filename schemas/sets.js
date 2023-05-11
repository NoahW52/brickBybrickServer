const mongoose = require('mongoose')

const setsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    set_img_url: {type: String},
    num_parts: {type: Number},
    year: {type: Number}
})

module.exports = mongoose.model('Sets', setsSchema)