const mongoose = require('mongoose')
const {itemschema} = require("./itemmodel")

const sellerschema = mongoose.Schema({
    name:String,
    email:String,
    phone :String,
    password:String,
    items:[itemschema],
    solditems:[itemschema]
  } ,  {
    timestamps: true // This will add createdAt and updatedAt fields automatically
  } )

const sellermodel = mongoose.model("sellers", sellerschema)
  
  module.exports=sellermodel