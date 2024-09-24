const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");

class UserAuctionController {
    static async renderAuctionPage(req, res) {
        let name = " ";
        try {
            const user = await usermodel.findOne({ _id: req.params.userid });
            name = user.email;

            const item = await itemmodel.findOne({ _id: req.params.itemid });
            if (!item) {
                res.send('<h1>Item Sold</h1><br><a href="/user/' + req.params.userid + '">Back to User Profile</a>');
                return;
            }
            if (item.auction_over) {
                res.send("item sold");
                res.redirect("/user/" + req.params.userid);
                return;
            }
            if (item.pid == req.params.userid) {
                res.redirect("/" + req.params.userid + "/auction/item/" + req.params.itemid + "/owner");
                return;
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
            name = user.username;

            const item = await itemmodel.findOne({ _id: req.params.itemid });
            if (!item) {
                res.send("item sold");
                return;
            }
            if (price < item.current_price || price < item.base_price) {
                res.redirect("/auction/" + req.params.userid + "/item/" + req.params.itemid);
            } else {
                item.current_price = price;
                item.current_bidder = name;
                item.current_bidder_id = req.params.userid;
                item.auction_history.push({ bidder: name, price: price.toString() });
                await item.save();
                res.status(200).send({ message: "success", item: item });
            }
        } catch (error) {
            console.error("Error placing bid:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = UserAuctionController;