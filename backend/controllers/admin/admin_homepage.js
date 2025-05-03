const sellermodel = require("../../models/sellermodel");
const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");
const getRedisClient = require("../../redis");
const PerformanceLog = require("../../models/PerformanceLog");

// Log performance
const logPerformance = async (req, source, responseTime) => {
  await PerformanceLog.create({
    endpoint: '/admin',
    method: req.method,
    source,
    responseTime,
  });
};

const adminPageGet = async (req, res) => {
  const start = Date.now();
  try {
    const client = await getRedisClient(); // Ensure Redis is connected
    let source;
    let time;

    const cachedAdminData = await client.get("admin:data");
    if (cachedAdminData) {
      time = Date.now() - start;
      source = "cache";
      await logPerformance(req, source, time);
      return res.status(200).send({ source, responseTime: time, data: JSON.parse(cachedAdminData) });
    }

    // DB fetch
    const users = await usermodel.find();
    const items = await itemmodel.find();
    const sellers = await sellermodel.find();

    const data = { users, sellers, items };

    await client.set("admin:data", JSON.stringify(data), { EX: 3600 }); // cache for 1 hour
    time = Date.now() - start;
    source = "db";

    await logPerformance(req, source, time);

    res.status(200).send({ source, responseTime: time, data });
  } catch (error) {
    console.error("Error in adminPageGet:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { adminPageGet };
