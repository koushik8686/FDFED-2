const sellermodel = require("../../models/sellermodel");
const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");
const getRedisClient = require("../../redis");

async function sellingPageGet(req, res) {
    try {
        const seller = await sellermodel.findById(req.params.seller);
        if (!seller) {
            return res.status(404).send({ message: "Seller not found" });
        }

        const item = await itemmodel.findById(req.params.itemid);
        if (!item) {
            return res.status(404).send({ message: "Item Sold" });
        }

        res.status(200).send({ data: { user: req.params.seller, username: seller.name, item } });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

async function sellingPagePost(req, res) {
    try {
        const client = await getRedisClient();

        const item = await itemmodel.findById(req.params.itemid);
        if (!item) {
            return res.status(404).send({ message: "Item already sold" });
        }

        item.person = item.current_bidder;

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

        const user = await usermodel.findById(item.current_bidder_id);
        if (!user) {
            return res.status(404).send({ message: "Buyer not found" });
        }

        user.items.push(item);
        await user.save();

        await itemmodel.deleteOne({ _id: req.params.itemid });
        await client.flushAll();

        res.status(200).send({ message: "Item sold successfully", item });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}

module.exports = { sellingPageGet, sellingPagePost };
