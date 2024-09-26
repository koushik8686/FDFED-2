const express = require('express');
const SellingController = require("../../controllers/seller/sell_item");

class UserAuctionRouter {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Directly use the controller methods for route handling
        this.router.get("/:userid/item/:itemid", SellingController.sellingPageGet);
        this.router.post("/:userid/item/:itemid", SellingController.sellingPagePost);
    }

    getRouter() {
        return this.router;
    }
}

// Create an instance of the UserAuctionRouter
const userAuctionRouter = new UserAuctionRouter();
module.exports = userAuctionRouter.getRouter();
