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

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "hexart637@gmail.com",
                pass: 'zetk dsdm imvx keoa'
            }
        });

        const verificationLink = `http://localhost:3000/verify/${newUser._id}`;
        const mailOptions = {
            from: "hexart637@gmail.com",
            to: email,
            subject: 'Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h3>Welcome to HexArt!</h3>
                    <p>To complete your registration, please verify your email address by clicking the button below.</p>
                    <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #00ADB5; text-decoration: none; border-radius: 5px;">Verify Email</a>
                    <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
                    <p>${verificationLink}</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Mail sent successfully to receiver");
            }
        });
        responseTime = Date.now() - start;
        
        await PerformanceLog.create({
            endpoint: '/user/register',
            method: req.method,
            source: 'db',
            responseTime
        });

        res.status(201).send({ message: "Verification Email Sent To Your Email" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { userregister_post };
