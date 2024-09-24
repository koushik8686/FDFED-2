const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");

class UserController {
    static async renderUserHome(req, res) {
        console.log("received request", req.params.email);

        try {
            const user = await usermodel.findOne({ _id: req.params.email });
            const items = await itemmodel.find();

            const data = {
                user: user,
                id: req.params.email,
                items: items
            };

            return res.status(200).send({ message: "Data Fetched Successfully", data: data });
        } catch (error) {
            console.error("Error fetching data:", error);
            return res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = UserController;