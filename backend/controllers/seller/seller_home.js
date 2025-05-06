const sellermodel = require("../../models/sellermodel");
const { itemmodel } = require("../../models/itemmodel");
const getRedisClient = require("../../redis");
const PerformanceLog = require("../../models/PerformanceLog");

// Helper for performance log
const logPerformance = async (req, source, responseTime) => {
    await PerformanceLog.create({
        endpoint: '/seller/:id',
        method: req.method,
        source,
        responseTime,
    });
};

async function renderSellerHome(req, res) {
    const start = Date.now();
    const { id } = req.params;

    try {
        const client = await getRedisClient(); // Ensure Redis client is connected
        let seller;
        let source;
        let time = 0;
        
        // Check Redis cache first
        const cachedSeller = await client.get(`seller:${id}`);
        if (cachedSeller) {
            seller = JSON.parse(cachedSeller);
            time = Date.now() - start;
            source = 'cache';
        } else {
            seller = await sellermodel.findOne({ _id: id });
            if (!seller) return res.status(404).send("Seller not found");
            time = Date.now() - start;
            await client.set(`seller:${id}`, JSON.stringify(seller), { EX: 3600 });
            source = 'db';
        }

        // Get items (consider caching these as well if they don't change often)
        const itemIds = seller.items.map(item => item._id); // extract all _id values
        const items = await itemmodel.find({ _id: { $in: itemIds } });
        
        await logPerformance(req, source, time);

        res.status(200).send({ 
            message: "Data Fetched Successfully", 
            source, 
            responseTime: time, 
            seller,
            items
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { renderSellerHome };