const sellermodel = require("../../models/sellermodel");
const { itemmodel } = require("../../models/itemmodel");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function createAuctionPost(req, res) {
  try {

    const seller = await sellermodel.findById(req.params.seller);

    if (!seller) {
      return res.status(404).send({ message: "Seller not found" });
    }

    // Upload image to Cloudinary using the file buffer
  
    // Combine date and time strings into proper Date objects.
    const dateString = req.body.date; // expect format "YYYY-MM-DD"
    const startTime = new Date(`${dateString}T${req.body.StartTime}:00`);
    const endTime = new Date(`${dateString}T${req.body.EndTime}:00`);
    console.log(req.body)
    const item = new itemmodel({
      name: req.body.name,
      person: seller.name,
      pid: req.params.seller,
      url: req.file.path, // Use Cloudinary URL
      base_price: req.body.basePrice,
      type: req.body.type,
      current_price: req.body.basePrice,
      current_bidder: "",
      current_bidder_id: "",
      aution_active: true, // Auction is active initially
      date: new Date(dateString),
      StartTime: startTime,
      EndTime: endTime,
      visited_users: [],
      auction_history: []
    });

    await item.save();
    console.log("Item saved");

    seller.items.push(item);
    await seller.save();
    console.log("Seller updated with new item");

    return res.status(200).send({ message: "Item created successfully" });
  } catch (error) {
    console.error("Error creating auction:", error);
    return res.status(500).send({ message: "An error occurred while creating auction" });
  }
}

module.exports = { createAuctionPost };
