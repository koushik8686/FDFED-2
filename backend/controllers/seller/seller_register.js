const bcrypt = require('bcryptjs');
const sellermodel = require("../../models/sellermodel");
const unverified_sellers = require("../../models/unverifiedsellers");
const nodemailer = require('nodemailer');

async function sellerregister_post(req, res) {
    const { name, email, phone, password } = req.body;

    try {
        const unverifiedSeller = await unverified_sellers.findOne({ email });
        const verifiedSeller = await sellermodel.findOne({ email });
        if (unverifiedSeller || verifiedSeller) {
            return res.status(200).send({ message: "Email Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSeller = new unverified_sellers({
            name,
            email,
            phone,
            password: hashedPassword,
            items: []
        });

        await newSeller.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "hexart637@gmail.com",
                pass: 'zetk dsdm imvx keoa'
            }
        });

        const verificationLink = `http://localhost:3000/seller/verify/${newSeller._id}`;
        const mailOptions = {
            from: "hexart637@gmail.com",
            to: email,
            subject: 'Verify Your Seller Email',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h3>Welcome to HexArt!</h3>
                    <p>Please verify your email address by clicking the button below.</p>
                    <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #00ADB5; text-decoration: none; border-radius: 5px;">Verify Email</a>
                    <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
                    <p>${verificationLink}</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log("Error sending email:", error);
            } else {
                console.log("Verification email sent successfully");
            }
        });

        res.status(200).send({ message: "Verification Email Sent To Your Email" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { sellerregister_post };
