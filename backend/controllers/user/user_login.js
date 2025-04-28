const bcrypt = require('bcryptjs');
const usermodel = require("../../models/usermodel");

async function userlogin_post(req, res) {
    const { email, password } = req.body;

    try {
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(200).send({ message: "No Email" });
        }
        if (!user.password) {
            return res.status(200).send({ message: "Please Sign In With Google" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
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
