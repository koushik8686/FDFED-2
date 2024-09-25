const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");

class UserAuctionController {
    static async renderAuctionPage(req, res) {
        let name = " ";
        try {
            const user = await usermodel.findOne({ _id: req.params.userid });
            if (!user) {
                return res.status(404).send("User not found");
            }
            name = user.email;

            const item = await itemmodel.findOne({ _id: req.params.itemid });
            if (!item) {
                return res.status(404).send("Item not found");
            }
            if (item.auction_over) {
                return res.status(410).send("Item sold");
            }
          
            const isVisited = item.visited_users.some(user => user.id === req.params.userid);
            if (!isVisited) {
                item.visited_users.push({ id: req.params.userid, email: name });
                await item.save();
            }
            const data = {
                user: req.params.userid,
                username: name,
                item: item
            };
            res.status(200).send({ data: data });
        } catch (error) {
            console.error("Error rendering auction page:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async bid(req, res) {
        console.log(req.body);
        let price = Number(req.body.bid);
        let name = " ";
        try {
            const user = await usermodel.findOne({ _id: req.params.userid });
            if (!user) {
                return res.status(404).send("User not found");
            }
            name = user.username;

            const item = await itemmodel.findOne({ _id: req.params.itemid });
            if (!item) {
                return res.status(404).send("Item not found");
            }
            if (item.auction_over) {
                return res.status(410).send("Item sold");
            }
            if (price < item.current_price || price < item.base_price) {
                return res.status(400).send("Bid amount is less than the current price or base price");
            } else {
                item.current_price = price;
                item.current_bidder = name;
                item.current_bidder_id = req.params.userid;
                item.auction_history.push({ bidder: name, price: price.toString() });
                await item.save();
                res.status(200).send({ message: "Bid placed successfully", item: item });
            }
        } catch (error) {
            console.error("Error placing bid:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = UserAuctionController;
