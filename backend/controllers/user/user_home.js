const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");
const getRedisClient = require("../../redis");
const PerformanceLog = require("../../models/PerformanceLog");

// Helper for performance log
const logPerformance = async (req, source, responseTime) => {
    await PerformanceLog.create({
        endpoint: '/user/:id',
        method: req.method,
        source,
        responseTime,
    });
};

async function renderUserHome(req, res) {
    const start = Date.now();
    const { email } = req.params;

    try {
        const client = await getRedisClient(); // Ensure Redis client is connected
        let user;
        let source;
        let time = 0;
        const cachedUser = await client.get(`user:${email}`);
        if (cachedUser) {
            user = JSON.parse(cachedUser);
            time = Date.now() - start;
            source = 'cache';
        } else {
            user = await usermodel.findOne({ _id: email });
            if (!user) return res.status(404).send("User not found");
            time = Date.now() - start;
            await client.set(`user:${email}`, JSON.stringify(user), { EX: 3600 });
            source = 'db';
        }

        const items = await itemmodel.find();

        const data = {
            user,
            id: email,
            items
        };

        await logPerformance(req, source, time);

        res.status(200).send({ message: "Data Fetched Successfully", source, responseTime: time, data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { renderUserHome };