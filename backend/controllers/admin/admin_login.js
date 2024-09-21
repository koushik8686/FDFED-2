const path = require("path");
const adminmodels = require("../../models/adminmodel");

async function adminlogin_post(req, res) {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const admin = await adminmodels.findOne({ email, password });
    if (admin) {
      return res.status(200).send({ message: "Login Successfully", admin: admin._id });
    } else {
      return res.status(401).send({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
}

module.exports = { adminlogin_post };