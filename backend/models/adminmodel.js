const mongoose= require('mongoose')

const adminschema = mongoose.Schema({
    email:String,
    password:String,
} ,
{
    timestamps: true // This will add createdAt and updatedAt fields automatically
  } )
const adminmodel = mongoose.model('admins' , adminschema)

module.exports = adminmodel