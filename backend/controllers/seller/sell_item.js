const sellermodel = require("../../models/sellermodel");
const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");
const nodemailer = require('nodemailer');

class SellingController {

  static async sellingPageGet(req, res) { 
    try {
      const seller = await sellermodel.findById(req.params.seller);
      if (!seller) {
        return res.status(404).send({ message: "Seller not found" });
      }

      const item = await itemmodel.findById(req.params.itemid);
      if (!item) {
        return res.status(404).send({ message: "Item Sold" });
      }

      const data = {
        user: req.params.seller,
        username: seller.name,
        item: item
      };

      return res.status(200).send({ data });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

 static async sellingPagePost(req, res) {
    try {
      const item = await itemmodel.findById(req.params.itemid);
      if (!item) {
        return res.status(404).send({ message: "Item already sold" });
      }
      
      console.log(req.params);
      // Assign the current bidder to the sold item
      item.person = item.current_bidder;
      // await item.save();

      // Remove the sold item from the seller's items
      const seller = await sellermodel.findOneAndUpdate(
        { _id: req.params.seller },
        { $pull: { items: { _id: req.params.itemid } } },
        { new: true }
      );

      if (!seller) {
        return res.status(404).send({ message: "Seller not found" });
      }

      seller.solditems.push(item);
      await seller.save();
      const buyerId = item.current_bidder_id;
      const user = await usermodel.findById(buyerId);
      if (!user) {
        return res.status(404).send({ message: "Buyer not found" });
      }
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "hexart637@gmail.com", 
          pass: 'zetk dsdm imvx keoa', 
        }
      });
      // Send email to the buyer
      const mailOptions = {
        from: seller.email,
        to: user.email,
        subject: 'Item Bid Successful',
        html: `<h3>Congratulations</h3>
               <p>The seller has sold the item you were bidding on to you</p>
               <h5>Item Details :</h5>
               <p>Name: ${item.name}</p>
               <p>Price: ${item.base_price}</p>
               <p>Email: ${seller.email}</p>`
      };
      
      await transporter.sendMail(mailOptions);
      console.log("Mail sent successfully to receiver");
      // Add the sold item to the buyer's items
      user.items.push(item);
      await user.save();
      await itemmodel.deleteOne({ _id: req.params.itemid })
      .then(() => {
        console.log("Item deleted");
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
          return res.status(200).send({ message: "Item sold successfully", item });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

module.exports = SellingController;
