
const path = require("path");
const adminmodels = require("../../models/adminmodel");

function adminlogin_post (req, res) { 
  var email = req.body.email
  var pass = req.body.pass
  adminmodels.find().then((arr) => {
    var admin;
    for (let index = 0; index < arr.length; index++) {
      if (arr[index].password == pass && arr[index].email == email) {
        admin = arr[index];
        break; // Exit loop once user is found
      }
    }
    if (!admin) {
      res.redirect("/");
    } else {
      if (admin.password == pass) {
        var AdminId = admin._id;
        return res.status(200).send({ message: "Login Successfuly"  ,admin:admin._id });
      } else {
        res.send("Wrong password");
      }
    }
  });
   }

module.exports={ adminlogin_post}