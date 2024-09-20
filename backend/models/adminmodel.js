const mongoose= require('mongoose')

const adminschema = mongoose.Schema({
    email:String,
    password:String,
})
const adminmodel = mongoose.model('admins' , adminschema)

module.exports = adminmodel