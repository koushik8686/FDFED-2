const usermodel = require("../../models/usermodel");

function userregister_post(req, res) { 
    const username = req.body.username;
    const email = req.body.email;
    const pass = req.body.password;
    console.log(email, pass);

    // Check if a user with the given email already exists
    usermodel.findOne({ email: email })
        .then((user) => {    
            if (user) {
               return res.status(200).send({ message: "Email Already Exists" });

            }

            const newUser = new usermodel({
                username: username,
                email: email,
                password: pass, // Storing plain text password (not recommended)
                items: []
            });
            
            newUser.save()
            .then(() => {
                res.status(200).send({ message: "Account Created Successfully", userId: newUser._id });
            })
                .catch((error) => {
                    console.error("Error saving new user:", error);
                    res.status(500).send("Internal Server Error");
                });
        })
        .catch((error) => {
            console.error("Error checking if user exists:", error);
            res.status(500).send("Internal Server Error");
        });
}

module.exports = {
    userregister_post
};
