const express = require('express');
const SellingController = require("../../controllers/seller/sell_item");
const {logSellerActions , sellerErrorMiddleware} = require('../../middleware/Seller')

class SellerController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/:seller/:itemid", logSellerActions , sellerErrorMiddleware, SellingController.sellingPageGet);
        this.router.post("/:seller/:itemid", logSellerActions , sellerErrorMiddleware, SellingController.sellingPagePost);
    }

    getRouter() {
        return this.router;
    }
}

// Create an instance of the SellerController
const SellerRouter = new SellerController();
module.exports = SellerRouter.getRouter();
