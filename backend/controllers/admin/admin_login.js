const adminmodels = require("../../models/adminmodel");

class AdminController {
  static async login(req, res) {
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
}

module.exports = AdminController;
