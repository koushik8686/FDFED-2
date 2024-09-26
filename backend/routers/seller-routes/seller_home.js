const express = require('express')
const router = express.Router()
const SellerHomeController = require("../../controllers/seller/seller_home")

class SellerHomeRouter {
    constructor() {
        this.router = express.Router()
        this.initializeRoutes()
    }
    initializeRoutes() {
        this.router.get("/:id", SellerHomeController.renderSellerHome);
    }
    getRouter() {
        return this.router;
    }
}

module.exports= new SellerHomeRouter().getRouter();