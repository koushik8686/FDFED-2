const sellermodel = require("../../models/sellermodel");
const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");

class AdminController {
  static async adminPageGet(req, res) {
    try {
      const users = await usermodel.find();
      const items = await itemmodel.find();
      const sellers = await sellermodel.find();

      const data = {
        users,
        sellers,
        items,
      };
      res.status(200).send({ data });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = AdminController;
