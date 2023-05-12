const mongoose = require('mongoose')

const setsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    set_num: {type: String},
    set_img_url: {type: String},
    num_parts: {type: Number},
    year: {type: Number}
})

const Sets = mongoose.model('Sets', setsSchema)
module.exports = Sets