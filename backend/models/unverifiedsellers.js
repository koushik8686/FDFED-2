const mongoose = require('mongoose')
const {itemschema} = require("./itemmodel")

const sellerschema = mongoose.Schema({
    name:String,
    email:String,
    phone :String,
    password:String,
    items:[itemschema],
  })

const sellermodel = mongoose.model("unverified_sellers", sellerschema)
module.exports=sellermodel