const express = require('express');
const multer = require("multer");
const path = require('path');
const AuctionController = require("../../controllers/seller/create_auction"); // Adjust the path as needed

class AuctionRouter {
  constructor() {
    this.router = express.Router();
    this.upload = this.configureMulter();
    this.initializeRoutes();
  }

  configureMulter() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads")); // Correctly resolve the directory path
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Generate a unique file name with the current timestamp
      },
    });
    return multer({ storage: storage });
  }

  initializeRoutes() {
    this.router.post("/:seller", this.upload.single('image'), (req, res) => {
      return AuctionController.createAuctionPost(req, res);
    });
  }
}

module.exports = new AuctionRouter().router;
