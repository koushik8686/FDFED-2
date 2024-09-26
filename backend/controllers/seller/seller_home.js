const sellermodel = require("../../models/sellermodel");
const { itemmodel } = require("../../models/itemmodel");

class SellerHomeController {
   static async renderSellerHome(req, res) {
        try {
            const seller = await sellermodel.findOne({ _id: req.params.id });
            if (!seller) {
                return res.status(404).send("Seller not found");
            }

            const items = await itemmodel.find({ _id: { $in: seller.items } });
            return res.status(200).send({ seller: seller, items: items });
        } catch (error) {
            console.error("Error finding items:", error);
            return res.status(500).send("Internal Server Error");
        }
    }
}

module.exports =  SellerHomeController;
