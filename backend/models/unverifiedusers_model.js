const mongoose = require('mongoose')
const {itemschema} = require("./itemmodel")

const userschema = mongoose.Schema({
    username:String,
    email:String,
    password:String,
    items:[itemschema],
} ,  {
    timestamps: true // This will add createdAt and updatedAt fields automatically
  })
const usermodel = mongoose.model("unverified_users",userschema)
module.exports =usermodel 