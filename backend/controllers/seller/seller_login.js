const bcrypt = require('bcryptjs');
const sellermodel = require("../../models/sellermodel");

async function sellerlogin_post(req, res) {
    const { email, password } = req.body;

    try {
        const seller = await sellermodel.findOne({ email });
        if (!seller) {
            return res.status(200).send({ message: "Wrong Email" });
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(200).send({ message: "Wrong Password" });
        }

        res.status(200).send({ message: "Login Successfully", sellerId: seller._id });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { sellerlogin_post };
