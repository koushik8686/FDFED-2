const express = require('express');
const SellingController = require("../../controllers/seller/sell_item");

class SellerController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/:seller/:itemid", SellingController.sellingPageGet);
        this.router.post("/:seller/:itemid", SellingController.sellingPagePost);
    }

    getRouter() {
        return this.router;
    }
}

// Create an instance of the SellerController
const SellerRouter = new SellerController();
module.exports = SellerRouter.getRouter();
