const bcrypt = require('bcryptjs');
const sellermodel = require("../../models/sellermodel");
const path = require("path");

function sellerlogin_get(req, res) { 
  if (get_sellersession(req)) {
    return res.redirect("/sellerhome/" + get_sellersession(req));
  }
  res.sendFile(path.join(__dirname, "../../views/sellerlogin.html"));
}

async function sellerlogin_post(req, res) {
  var email = req.body.email;
  var pass = req.body.password;

  try {
    // Find the seller with the provided email
    const seller = await sellermodel.findOne({ email: email });

    if (!seller) {
      // If no seller is found with the provided email, send an error response
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

module.exports = { sellerlogin_get, sellerlogin_post };
