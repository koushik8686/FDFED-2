const sellermodel = require("../../models/sellermodel");
const { itemmodel } = require("../../models/itemmodel");

async function renderSellerHome(req, res) {
    try {
        const seller = await sellermodel.findOne({ _id: req.params.id });
        if (!seller) {
            return res.status(404).send("Seller not found");
        }

        const items = await itemmodel.find({ _id: { $in: seller.items } });
        res.status(200).send({ seller, items });
    } catch (error) {
        console.error("Error finding items:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { renderSellerHome };
