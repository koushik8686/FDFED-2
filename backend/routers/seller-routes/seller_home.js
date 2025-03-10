const express = require('express')
const router = express.Router()
const SellerHomeController = require("../../controllers/seller/seller_home")
const {logSellerActions , sellerErrorMiddleware} = require('../../middleware/Seller')

class SellerHomeRouter {
    constructor() {
        this.router = express.Router()
        this.initializeRoutes()
    }
    initializeRoutes() {
        this.router.get("/:id", logSellerActions , sellerErrorMiddleware,SellerHomeController.renderSellerHome);
    }
    getRouter() {
        return this.router;
    }
}

module.exports= new SellerHomeRouter().getRouter();