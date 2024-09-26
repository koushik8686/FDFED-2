const sellermodel = require("../../models/sellermodel");
const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");
var email = "hexart637@gmail.com";
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: 'zetk dsdm imvx keoa', // Consider using environment variables for sensitive data
  }
});

async function sellingpage_get(req, res) { 
  var name = "";
  await sellermodel.findOne({_id: req.params.seller}).then((result) => {
    name = result.name;
  });
  await itemmodel.findOne({_id: req.params.itemid}).then((result) => {
    if (!result) {
      res.status(404).send({ message: "Item Sold" });
      return;
    }
    if (result.auction_active) {
      res.send("item sold");
    }
    var data = {
      user: req.params.seller,
      username: name,
      item: result
    };
    res.status(200).send({ data: data });
  });
}

async function sellingpage_post(req, res) {
  try {
    let solditem;
    const itemResult = await itemmodel.findOne({ _id: req.params.itemid });
    
    if (!itemResult) {
      return res.status(404).send({ message: "Item already sold" });
    }
    // Assign the current bidder to the sold item
    itemResult.person = itemResult.current_bidder;
    solditem = itemResult;
    await itemResult.save();

    // Remove the sold item from the seller's items
    const seller =await sellermodel.findOneAndUpdate(
      { _id: req.params.seller },
      { $pull: { items: { _id: req.params.itemid } } },
      { new: true }
    );
    

    seller.solditems.push(solditem);
    await seller.save();

    const buyerEmail = await sellermodel.findById(req.params.seller).then(result => result.email);
    const buyerId = itemResult.current_bidder_id;
    
    const user = await usermodel.findById(buyerId);
    if (!user) {
      return res.status(404).send({ message: "Buyer not found" });
    }

    // Send email to the buyer
    const mailOptions = {
      from: buyerEmail,
      to: user.email,
      subject: 'Item Bid Successful',
      html: `<h3>Congratulations</h3>
             <p>The seller has sold the item you were bidding on to you</p>
             <h5>Item Details :</h5>
             <p>Name: ${solditem.name}</p>
             <p>Price: ${solditem.base_price}</p>
             <p>Email: ${buyerEmail}</p>`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail sent successfully to receiver");
      }
    });

    // Add the sold item to the buyer's items
    user.items.push(solditem);
    await user.save();
    await itemmodel.deleteOne({ _id: req.params.itemid });
    // Respond with a success message and the sold item details
    return res.status(200).send({ message: "Item sold successfully", item: solditem });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
}

module.exports = { sellingpage_get, sellingpage_post };
