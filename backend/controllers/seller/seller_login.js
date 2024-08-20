const sellermodel =  require("../../models/sellermodel")
const {itemmodel} =  require("../../models/itemmodel")
const {set_sellersession, get_sellersession } = require("../../middleware/seller-sessions/sellerauth")

const path = require("path");

function sellerlogin_get(req, res) { 
  if (get_sellersession(req)) {
    return res.redirect("/sellerhome/"+get_sellersession(req));
   }
    res.sendFile(path.join(__dirname, "../../views/sellerlogin.html"));
}
function sellerlogin_post(req, res) { 
  var email = req.body.email;
  var pass = req.body.password;

  // Find the seller with the provided email
  sellermodel.findOne({ email: email }).then((seller) => {
      if (!seller) {
          // If no seller is found with the provided email, redirect to seller registration page
          return res.status(200).send({ message: "Wrong Email" });
        }

      // Check if the provided password matches the seller's password
      if (seller.password !== pass) {
          // If the passwords don't match, send a response indicating wrong password
          return res.status(200).send({ message: "Wrong Password" });
      }
      // Redirect to the seller's home page
      return res.status(200).send({ message: "Login Successfully" , sellerId: seller._id});
    }).catch((error) => {
      console.error("Error finding seller:", error);
      res.status(500).send("Internal Server Error");
  });
}


module.exports = {sellerlogin_get, sellerlogin_post}