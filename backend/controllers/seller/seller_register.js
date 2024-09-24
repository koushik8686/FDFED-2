const bcrypt = require('bcryptjs');
const sellermodel = require("../../models/sellermodel");
const path = require("path");

function sellerregister_get(req, res) { 
    res.sendFile(path.join(__dirname, "../../views/sellerregister.html"));
}

function sellerregister_post(req, res) { 
    var email = req.body.email;

    sellermodel.findOne({ email: email }).then((user) => {
        if (user) {
            return res.status(200).send({ message: "Email Already Exists" });
        }

        // Hash the password before saving it
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).send("Internal Server Error");
            }

            // Create a new seller with the hashed password
            const newSeller = new sellermodel({
                name: req.body.name,
                email: email,
                phone: req.body.phone,
                password: hashedPassword, // Save the hashed password
                items: []
            });

            newSeller.save().then(() => {
                res.status(200).send({ message: "Account Created Successfully", sellerId: newSeller._id });
            }).catch((error) => {
                console.error("Error saving new seller:", error);
                res.status(500).send("Internal Server Error");
            });
        });

    }).catch((error) => {
        console.error("Error finding seller:", error);
        res.status(500).send("Internal Server Error");
    });
}

module.exports = { sellerregister_get, sellerregister_post };
