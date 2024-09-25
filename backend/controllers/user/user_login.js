const bcrypt = require('bcryptjs');
const usermodel = require("../../models/usermodel");

class UserController {
    static async userlogin_post(req, res) {
        const email = req.body.email;
        const pass = req.body.password;
        console.log("User login");
        console.log(email, pass);
        try {
            const user = await usermodel.findOne({ email: email });

            if (!user) {
                console.log("No email");
                return res.status(200).send({ message: "No Email" });
            }
            const isMatch = await bcrypt.compare(pass, user.password);
            if (isMatch) {
                const userId = user._id;
                console.log("Login successful");
                // set_session(req, userId);
                return res.status(200).send({ message: "Login Successfully", userId: userId });
            } else {
                console.log("Wrong password");
                return res.status(200).send({ message: "Wrong Password" });
            }
        } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = UserController;
