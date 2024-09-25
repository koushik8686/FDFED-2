const bcrypt = require('bcryptjs');
const unverified_users = require("../../models/unverifiedusers_model");
const users = require("../../models/usermodel"); // Add the verified user model
var nodemailer = require('nodemailer');

class UserService {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Check if user exists in either unverified or verified collections
    async checkIfUserExists() {
        try {
            // Check in both unverified_users and users collections
            const unverifiedUser = await unverified_users.findOne({ email: this.email });
            const verifiedUser = await users.findOne({ email: this.email });

            if (unverifiedUser || verifiedUser) {
                return true; // Email exists in either collection
            }

            return false;
        } catch (error) {
            console.error("Error checking if user exists:", error);
            throw new Error("Internal Server Error");
        }
    }

    // Hash the user's password
    async hashPassword() {
        try {
            return await bcrypt.hash(this.password, 10);
        } catch (error) {
            console.error("Error hashing password:", error);
            throw new Error("Internal Server Error");
        }
    }

    // Save the new user to the unverified_users collection
    async saveUser(hashedPassword) {
        const email = "hexart637@gmail.com";
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: 'zetk dsdm imvx keoa'
            }
        });

        const newUser = new unverified_users({
            username: this.username,
            email: this.email,
            password: hashedPassword,
            items: []
        });

        try {
            await newUser.save();

            const verificationLink = `http://localhost:3000/verify/${newUser._id}`;

            const mailOptions = {
                from: email,
                to: this.email,
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

            // Send the verification email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Mail sent successfully to receiver");
                }
            });

            return newUser;
        } catch (error) {
            console.error("Error saving new user:", error);
            throw new Error("Internal Server Error");
        }
    }
}

// Controller for handling user registration requests
class UserController {
    static async userregister_post(req, res) {
        const { username, email, password } = req.body;
        const userService = new UserService(username, email, password);

        try {
            // Check if email exists in either unverified or verified collections
            const existingUser = await userService.checkIfUserExists();
            if (existingUser) {
                return res.status(200).send({ message: "Email Already Exists" });
            }

            // Hash password and save new user
            const hashedPassword = await userService.hashPassword();
            const newUser = await userService.saveUser(hashedPassword);
            res.status(200).send({ message: "Verification Email Sent To Your Email" });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = UserController;
