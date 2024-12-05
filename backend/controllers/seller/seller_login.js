const bcrypt = require('bcryptjs');
const sellermodel = require("../../models/sellermodel");

class SellerLogin{
  
  static async sellerlogin_post(req, res) {
    var email = req.body.email;
    var pass = req.body.password;
    try {
      const seller = await sellermodel.findOne({ email: email });
      if (!seller) {
        return res.status(200).send({ message: "Wrong Email" });
      }
  
      // Compare the provided password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(pass, seller.password);
  
      if (!isMatch) {
        // If the passwords don't match, send a response indicating wrong password
        return res.status(200).send({ message: "Wrong Password" });
      }
      return res.status(200).send({ message: "Login Successfully", sellerId: seller._id });
  
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}



module.exports = SellerLogin;
