const usermodel = require('../../models/usermodel');
const { itemmodel } = require('../../models/itemmodel');
const getRedisClient = require('../../redis');
const PerformanceLog = require('../../models/PerformanceLog');

async function getLikedItems(req, res) {
    const start = Date.now();
    let source = 'db';
    let responseTime;

    try {
        const user = await usermodel.findById(req.params.id).populate('liked');
        if (!user) return res.status(404).send({ message: 'User not found' });

        const likedItems = user.liked;
        responseTime = Date.now() - start;

        await PerformanceLog.create({
            endpoint: '/liked/:id',
            method: req.method,
            source,
            responseTime,
        });

        res.status(200).json(likedItems);
    } catch (error) {
        console.error("Error fetching liked items:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function addLikedItems(req, res) {
    try {
        const client = await getRedisClient();
        const { userid, itemid } = req.params;
        const user = await usermodel.findById(userid);
        const item = await itemmodel.findById(itemid);

        if (!user || !item) {
            return res.status(404).send({ message: 'User or Item not found' });
        }

        user.liked.push(item);
        await user.save();

        // Invalidate cache
        await client.flushAll();

        res.status(200).json({ message: "Added to Liked items" });
    } catch (error) {
        console.error("Error adding liked item:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function deleteLikedItems(req, res) {
    try {
        const client = await getRedisClient();
        const { userid, itemid } = req.params;
        const user = await usermodel.findById(userid);
        const item = await itemmodel.findById(itemid);

        if (!user || !item) {
            return res.status(404).send({ message: 'User or Item not found' });
        }

        user.liked = user.liked.filter(i => i._id.toString() !== itemid);
        console.log("bef",user.liked.length)
        await user.save();
        console.log("aft",user.liked.length) 
        // Invalidate cache
        await client.flushAll();

        res.status(200).json({ message: "Deleted from Liked items" });
    } catch (error) {
        console.error("Error deleting liked item:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { getLikedItems, addLikedItems, deleteLikedItems };
