const sellermodel = require("../../models/sellermodel")
const usermodel = require("../../models/usermodel")
const {itemmodel} = require("../../models/itemmodel")
var email = "hexart637@gmail.com"
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: 'zetk dsdm imvx keoa'
  }
});

async function sellingpage_get(req, res) { 
    var name = ""
    await sellermodel.findOne({_id:req.params.seller}).then((result)=>{
     name=result.name
    })
   await itemmodel.findOne({_id:req.params.itemid}).then((result)=>{
    if (!result) {
      res.send('<h1 style="color: green; text-align: center;">Item Sold</h1><br><p style="text-align: center;"><a href="/sellerhome/' + req.params.seller + '" style="color: blue;">Back to User Profile</a></p>');
      return
    }
      if (result.aution_active) {
        res.send("item sold")
      }
     var data = {
      user: req.params.seller,
      username:name,
      item:result
     }
     console.log(data.item);
      res.status(200).send({data:data} )
     })
   }
async function sellingpage_post(req, res) {
    var solditem
   await itemmodel.findOne({_id:req.params.itemid}).then( async (result)=>{
     if (!result) {
       res.send("itemsold")
     }
         result.person=result.current_bidder
         result.save()
         solditem=result
   //deleting in owner
        await sellermodel.findOneAndUpdate(
          { _id: req.params.seller },
          { $pull: { items: { _id: req.params.itemid } } },
          { new: true }
        )
        var email=""
        await sellermodel.findOne({_id:req.params.seller}).then((result)=>{
         email=result.email;
        })
    //adding in buyer
    var buyer = result.current_bidder_id
   await usermodel.findOne({_id:buyer}).then ((user)=>{
    var mailOptions = {
      from: email,
      to: user.email,
      subject: 'Item Bid Successful',
      html: `<h3>Congratulations</h3>
      <p>The seller has sold the item you were bidding on to you</p>
      <h5>Item Details :</h5>
      <p>Name: ${solditem.name}</p>
      <p>Price: ${solditem.base_price}</p>
      <p>Phone: ${email}</p>`
  }
      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log("Maail sent successfully to receiver");
      }
    });  
      var itemlength = user.items.length
      user.items[itemlength]=solditem
      user.save()
    })
    })
    await itemmodel.deleteOne({ _id: req.params.itemid });
    res.redirect("/sellerhome/"+req.params.seller)
  }

module.exports= {sellingpage_get, sellingpage_post}