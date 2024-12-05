const bcrypt = require('bcryptjs');
const sellermodel = require("../../models/sellermodel");
const unverified_sellers = require("../../models/unverifiedsellers");
const nodemailer = require('nodemailer');

class SellerService {
    constructor(name, email, phone, password) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    // Check if seller exists in either unverified or verified collections
    async checkIfSellerExists() {
        try {
            const unverifiedSeller = await unverified_sellers.findOne({ email: this.email });
            const verifiedSeller = await sellermodel.findOne({ email: this.email });
            if (unverifiedSeller || verifiedSeller) {
                return true; // Email exists in either collection
            }

            return false;
        } catch (error) {
            console.error("Error checking if seller exists:", error);
            throw new Error("Internal Server Error");
        }
    }

    // Hash the seller's password
    async hashPassword() {
        try {
            return await bcrypt.hash(this.password, 10);
        } catch (error) {
            console.error("Error hashing password:", error);
            throw new Error("Internal Server Error");
        }
    }

    // Save the seller to the unverified_sellers collection and send email
    async saveSeller(hashedPassword) {
        const email = "hexart637@gmail.com";
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: 'zetk dsdm imvx keoa'
            }
        });

        const newSeller = new unverified_sellers({
            name: this.name,
            email: this.email,
            phone: this.phone,
            password: hashedPassword,
            items: []
        });

        try {
            await newSeller.save();
            const verificationLink = `http://localhost:3000/seller/verify/${newSeller._id}`;
            const mailOptions = {
                from: email,
                to: this.email,
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

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("Error sending email:", error);
                } else {
                    console.log("Verification email sent successfully");
                }
            });

            return newSeller;
        } catch (error) {
            console.error("Error saving unverified seller:", error);
            throw new Error("Internal Server Error");
        }
    }
}

// Controller for seller registration
class SellerController {
    static async sellerregister_post(req, res) {
        const { name, email, phone, password } = req.body;
        const sellerService = new SellerService(name, email, phone, password);
        try {
            // Check if seller already exists
            const existingSeller = await sellerService.checkIfSellerExists();
            if (existingSeller) {
                return res.status(200).send({ message: "Email Already Exists" });
            }
            // Hash password and save new seller
            const hashedPassword = await sellerService.hashPassword();
            await sellerService.saveSeller(hashedPassword);

            res.status(200).send({ message: "Verification Email Sent To Your Email" });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = SellerController;
