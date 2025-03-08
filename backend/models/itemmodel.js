const mongoose= require('mongoose')

const itemschema= mongoose.Schema({
    name:String,
    person:String,
    pid:String,
    url:String,
    base_price:Number,
    current_bidder:String,
    current_bidder_id:String,
    current_price:String,
    type:String,
    aution_active:Boolean,
    date:Date,
    visited_users:[{id:String ,email:String}],
    auction_history: [{bidder: String,price: String}]
  } ,  {
    timestamps: true // This will add createdAt and updatedAt fields automatically
  })


const itemmodel = mongoose.model("items", itemschema)

module.exports= {
    itemschema,
    itemmodel
}
