const bcrypt = require('bcryptjs');
const usermodel = require("../../models/usermodel");
const { set_session, get_session } = require("../../middleware/user-cookies/userauth");
const path = require("path");

function userlogin_get(req, res) { 
    if (get_session(req)) {
        return res.redirect("/user/" + get_session(req));
    }
    res.sendFile(path.join(__dirname, "../../views/login.html"));
}

async function userlogin_post(req, res) { 
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

        // Compare the plain text password with the hashed password in the database
        const isMatch = await bcrypt.compare(pass, user.password);

        if (isMatch) {
            const userId = user._id;
            console.log("Login successful");
            
            // Set session or token if applicable
            set_session(req, userId);  // Assuming set_session sets a session or cookie

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

module.exports = {
    userlogin_get,
    userlogin_post
};
