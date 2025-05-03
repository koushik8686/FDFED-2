const sellermodel = require("../../models/sellermodel");
const usermodel = require("../../models/usermodel");
const { itemmodel } = require("../../models/itemmodel");
const getRedisClient = require("../../redis");

const deleteItem = async (req, res) => {
  const client = await getRedisClient(); // Redis client
  try {
    console.log("hello");
    await client.flushAll();
    const { type, id } = req.params;

    switch (type) {
      case "user":
        await usermodel.findByIdAndDelete(id);
        return res.status(200).send("User deleted successfully");

      case "seller":
        const seller = await sellermodel.findById(id);
        if (seller) {
          for (let i = 0; i < seller.items.length; i++) {
            await itemmodel.findByIdAndDelete(seller.items[i]._id);
          }
          await sellermodel.findByIdAndDelete(id);
          return res.status(200).send("Seller deleted successfully");
        } else {
          return res.status(404).send("Seller not found");
        }

      case "item":
        const item = await itemmodel.findById(id);
        if (!item) {
          return res.status(404).send("Item not found");
        }
        const sellerId = item.pid;
        await sellermodel.findOneAndUpdate(
          { _id: sellerId },
          { $pull: { items: { _id: id } } },
          { new: true }
        );
        await itemmodel.findByIdAndDelete(id);
        return res.status(200).send("Item deleted successfully");

      default:
        return res.status(400).send("Invalid type");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = { deleteItem };
