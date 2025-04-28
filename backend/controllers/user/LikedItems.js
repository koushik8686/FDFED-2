const usermodel = require('../../models/usermodel');
const { itemmodel } = require('../../models/itemmodel');

async function getLikedItems(req, res) {
    try {
        const user = await usermodel.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).json(user.liked);
    } catch (error) {
        console.error("Error fetching liked items:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function addLikedItems(req, res) {
    try {
        const user = await usermodel.findById(req.params.userid);
        const item = await itemmodel.findById(req.params.itemid);

        if (!user || !item) {
            return res.status(404).send({ message: 'User or Item not found' });
        }

        user.liked.push(item);
        await user.save();
        res.status(200).json({ message: "Added to Liked items" });
    } catch (error) {
        console.error("Error adding liked item:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function deleteLikedItems(req, res) {
    try {
        const user = await usermodel.findById(req.params.userid);
        const item = await itemmodel.findById(req.params.itemid);

        if (!user || !item) {
            return res.status(404).send({ message: 'User or Item not found' });
        }

        user.liked = user.liked.filter(i => i._id.toString() !== item._id.toString());
        await user.save();
        res.status(200).json({ message: "Deleted from Liked items" });
    } catch (error) {
        console.error("Error deleting liked item:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { getLikedItems, addLikedItems, deleteLikedItems };