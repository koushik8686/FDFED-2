const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");
const getRedisClient = require("../../redis");

async function renderAuctionPage(req, res) {
   
    try {
        const user = await usermodel.findOne({ _id: req.params.userid });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const item = await itemmodel.findOne({ _id: req.params.itemid });
        if (!item) {
            return res.status(404).send("Item not found");
        }
        if (item.auction_over) {
            return res.status(410).send("Item sold");
        }

        const isVisited = item.visited_users.some(user => user.id === req.params.userid);
        if (!isVisited) {
            item.visited_users.push({ id: req.params.userid, email: user.email });
            await item.save();
        }

        const data = {
            user: req.params.userid,
            username: user.email,
            item
        };

        res.status(200).send({ data });
    } catch (error) {
        console.error("Error rendering auction page:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function bid(req, res) {
    const client = await getRedisClient(); // Redis client
    const price = Number(req.body.bid);
    await client.flushAll();

    try {
        const user = await usermodel.findOne({ _id: req.params.userid });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const item = await itemmodel.findOne({ _id: req.params.itemid });
        if (!item) {
            return res.status(404).send("Item not found");
        }
        if (item.auction_over) {
            return res.status(410).send("Item sold");
        }
        if (price < item.current_price || price < item.base_price) {
            return res.status(400).send("Bid amount is less than the current price or base price");
        }

        item.current_price = price;
        item.current_bidder = user.username;
        item.current_bidder_id = req.params.userid;
        item.auction_history.push({ bidder: user.username, price: price.toString() });
        await item.save();

        res.status(200).send({ message: "Bid placed successfully", item });
    } catch (error) {
        console.error("Error placing bid:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { renderAuctionPage, bid };
