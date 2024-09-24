const bcrypt = require('bcryptjs');
const usermodel = require("../../models/usermodel");

// Service class handling user operations
class UserService {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Check if user exists in the database
    async checkIfUserExists() {
        try {
            return await usermodel.findOne({ email: this.email });
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

    // Save the new user to the database
    async saveUser(hashedPassword) {
        const newUser = new usermodel({username: this.username, email: this.email, password: hashedPassword, items: []});
        try {
            await newUser.save();
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
            const existingUser = await userService.checkIfUserExists();
            if (existingUser) return res.status(200).send({ message: "Email Already Exists" });
            const hashedPassword = await userService.hashPassword();
            const newUser = await userService.saveUser(hashedPassword);
            res.status(200).send({ message: "Account Created Successfully", userId: newUser._id });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = UserController;
