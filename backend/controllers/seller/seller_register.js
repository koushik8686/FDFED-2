const bcrypt = require('bcryptjs');
const sellermodel = require("../../models/sellermodel");
// const sellermodel = require("../../models/unverifiedsellers");
const nodemailer = require('nodemailer');
const getRedisClient = require("../../redis");
async function sellerregister_post(req, res) {
    const { name, email, phone, password } = req.body;
    const client = await getRedisClient();
    try {
        const unverifiedSeller = await sellermodel.findOne({ email });
        const verifiedSeller = await sellermodel.findOne({ email });
        if (unverifiedSeller || verifiedSeller) {
            return res.status(200).send({ message: "Email Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSeller = new sellermodel({
            name,
            email,
            phone,
            password: hashedPassword,
            subscription:"free",
            items: []
        });
        client.flushAll(); 
        await newSeller.save();
        res.status(200).send({ message: "Verification Email Sent To Your Email" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { sellerregister_post };
