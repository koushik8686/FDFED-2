const bcrypt = require('bcryptjs');
const users = require("../../models/usermodel");
const nodemailer = require('nodemailer');
const getRedisClient = require('../../redis');
const PerformanceLog = require('../../models/PerformanceLog');

async function userregister_post(req, res) {
    const start = Date.now();
    const { username, email, password } = req.body;
    const client = await getRedisClient(); // Ensure Redis client is connected
    let responseTime = 0;
    try {
        const cachedUser = await client.get(`user:${email}`);
        if (cachedUser) {
            responseTime = Date.now() - start;
            return res.status(200).send({ message: "Email Already Exists" });
        }

        const unverifiedUser = await users.findOne({ email });
        const verifiedUser = await users.findOne({ email });

        if (unverifiedUser || verifiedUser) {
             responseTime = Date.now() - start;
            return res.status(200).send({ message: "Email Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new users({
            username,
            email,
            password: hashedPassword,
            items: []
        });

        await newUser.save();
        await client.set(`user:${newUser.email}`, JSON.stringify(newUser), { EX: 3600 });

        // Remove admin data cache
        await client.del("admin:data");

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "hexart637@gmail.com",
                pass: 'zetk dsdm imvx keoa'
            }
        });

        responseTime = Date.now() - start;
        
        await PerformanceLog.create({
            endpoint: '/user/register',
            method: req.method,
            source: 'db',
            responseTime
        });

        res.status(201).send({ message: "Registration Successful" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { userregister_post };
