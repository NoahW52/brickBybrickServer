const mongoose = require('mongoose')

const SetListSchema = new mongoose.Schema({
    name: {type: String},
    set_img_url: {type: String},
    num_parts: {type: Number},
    year: {type: Number}
})

const SetList = mongoose.model('SetList', SetListSchema)
module.exports = SetList