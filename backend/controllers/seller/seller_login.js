const bcrypt = require('bcryptjs');
const sellermodel = require("../../models/sellermodel");
const PerformanceLog = require('../../models/PerformanceLog');
const getRedisClient = require('../../redis');

async function sellerlogin_post(req, res) {
    const { email, password } = req.body;
    const start = Date.now();
    const client = await getRedisClient(); // Ensure Redis client is connected

    try {
        const seller = await sellermodel.findOne({ email });
        if (!seller) return res.status(200).send({ message: "Wrong Email" });

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(200).send({ message: "Wrong Password" });
        }


        await client.del("admin:data");
        res.status(200).send({ message: "Login Successfully", sellerId: seller._id });

        await PerformanceLog.create({
            endpoint: '/seller/login',
            method: req.method,
            source: 'db',
            responseTime: Date.now() - start,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { sellerlogin_post };
