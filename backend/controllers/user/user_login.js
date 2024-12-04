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
            const userId = user._id;
            
            if (!user) {
                console.log("No email");
                return res.status(200).send({ message: "No Email" });
            }
            if (!user.password) {
                return res.status(200).send({ message: "PLease Sign In With Google" });
            }
            const isMatch = await bcrypt.compare(pass, user.password);
            if (isMatch) {
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
