const sellermodel = require("../../models/sellermodel");
const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");
const nodemailer = require('nodemailer');

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

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "hexart637@gmail.com",
                pass: 'zetk dsdm imvx keoa',
            }
        });

        const mailOptions = {
            from: seller.email,
            to: user.email,
            subject: 'Item Bid Successful',
            html: `<h3>Congratulations</h3>
                   <p>The seller has sold the item you were bidding on to you</p>
                   <h5>Item Details :</h5>
                   <p>Name: ${item.name}</p>
                   <p>Price: ${item.base_price}</p>
                   <p>Email: ${seller.email}</p>`
        };

        await transporter.sendMail(mailOptions);

        user.items.push(item);
        await user.save();

        await itemmodel.deleteOne({ _id: req.params.itemid });

        res.status(200).send({ message: "Item sold successfully", item });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}

module.exports = { sellingPageGet, sellingPagePost };
