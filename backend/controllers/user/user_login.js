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
    var email = req.body.email;
    var pass = req.body.password;
    console.log("User login");
    console.log(email, pass);
    try {
        const user = await usermodel.findOne({ email: email });

        if (!user) {
            console.log("no emsil");
            return res.status(200).send({ message: "No Email" });
        }

        // Directly compare passwords without hashing
        if (pass === user.password) {
            var userId = user._id;
            console.log("success");
           return res.status(200).send({ message: "Login Successfully" , userId: userId});
        } else {      
            console.log("wrong pass");       
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
