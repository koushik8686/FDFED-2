const sellermodel = require("../../models/sellermodel");
const { itemmodel } = require("../../models/itemmodel");

function createauction_get(req, res) { 
  res.render("create", { k: req.params.seller });
}

async function createauction_post(req, res) { 
  try {
    const seller = await sellermodel.findById(req.params.seller);

    if (!seller) {
      return res.status(404).send({ message: "Seller not found" });
    }

    const item = new itemmodel({
      name: req.body.name,
      person: seller.name,
      pid: req.params.seller,
      url: req.file.filename,
      base_price: req.body.basePrice,
      type: req.body.type,
      current_price: req.body.basePrice,
      current_bidder: " ",
      current_bidder_id: " ",
      class: req.body.class,
      auction_over: false,
      visited_users: [],
      auction_history: []
    });

    await item.save();
    console.log("Item saved");

    seller.items.push(item);
    await seller.save();
    console.log("Seller updated with new item");

    res.status(200).send({ message: "Item created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "An error occurred" });
  }
}

module.exports = { createauction_get, createauction_post };
