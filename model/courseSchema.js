const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({
    course:{
        type:String,
    },
    fees:{
        type:String,
    },
    content:{
        type:String,
    },
    duration :{
        type:String,
    },
    image:{
        type:String,
    }
})

module.exports = mongoose.model('COURSE TABLE',courseSchema)