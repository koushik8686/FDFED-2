const bcrypt = require('bcryptjs');
const usermodel = require("../../models/usermodel");
const getRedisClient = require('../../redis');
const PerformanceLog = require('../../models/PerformanceLog');

async function userlogin_post(req, res) {
    const start = Date.now();
    const { email, password } = req.body;

    try {
        let user;
        let source;
        const client = await getRedisClient(); // Ensure Redis client is connected
        var responseTime=0
        const cachedUser = await client.get(`user:${email}`);
        if (cachedUser) {
            user = JSON.parse(cachedUser);
            source = 'cache';
             responseTime = Date.now() - start;

        } else {
            user = await usermodel.findOne({ email });
            responseTime = Date.now() - start;

            if (!user) {
                return res.status(200).send({ message: "No Email" });
            }
            await client.set(`user:${email}`, JSON.stringify(user), { EX: 3600 });
            source = 'db';
        }

        if (!user.password) {
            return res.status(200).send({ message: "Please Sign In With Google" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        await PerformanceLog.create({
            endpoint: '/user/login',
            method: req.method,
            source,
            responseTime
        });

        if (isMatch) {
            return res.status(200).send({ message: "Login Successfully", userId: user._id });
        } else {
            return res.status(200).send({ message: "Wrong Password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { userlogin_post };
