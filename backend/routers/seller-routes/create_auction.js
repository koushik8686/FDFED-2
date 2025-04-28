const express = require('express');
const multer = require("multer");
const AuctionController = require("../../controllers/seller/create_auction");
const { logSellerActions, sellerErrorMiddleware } = require('../../middleware/Seller');
const { storage } = require('./storage');
const cloudinary = require("cloudinary").v2;
const router = express.Router();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configure multer for in-memory storage
const upload = multer({ storage: storage });

router.post("/:seller", logSellerActions, sellerErrorMiddleware, upload.single('image'), (req, res) => {
  
  console.log(req.file)
  return AuctionController.createAuctionPost(req, res);
});

module.exports = router;
