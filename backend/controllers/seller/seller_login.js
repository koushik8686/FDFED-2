const bcrypt = require('bcryptjs');
const sellermodel = require("../../models/sellermodel");
const getRedisClient = require('../../redis');
const PerformanceLog = require('../../models/PerformanceLog');

async function sellerlogin_post(req, res) {
    const { email, password } = req.body;
    const start = Date.now();

    try {
        const client = await getRedisClient();
        const cachedSeller = await client.get(`seller:${email}`);
        let seller;
        let source;
        if (cachedSeller) {
            seller = JSON.parse(cachedSeller);
            source = 'cache';
        } else {
            seller = await sellermodel.findOne({ email });
            if (!seller) return res.status(200).send({ message: "Wrong Email" });
            await client.set(`seller:${email}`, JSON.stringify(seller), { EX: 3600 });
            source = 'db';
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(200).send({ message: "Wrong Password" });
        }

        res.status(200).send({ message: "Login Successfully", sellerId: seller._id });

        await PerformanceLog.create({
            endpoint: '/seller/login',
            method: req.method,
            source,
            responseTime: Date.now() - start,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { sellerlogin_post };
