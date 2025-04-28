const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");

async function renderUserHome(req, res) {
    try {
        const user = await usermodel.findOne({ _id: req.params.email });
        const items = await itemmodel.find();

        const data = {
            user,
            id: req.params.email,
            items
        };

        res.status(200).send({ message: "Data Fetched Successfully", data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { renderUserHome };