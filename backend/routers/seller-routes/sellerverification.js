const express = require('express');
const SellerVerificationController = require('../../controllers/seller/verifyemail');

class SellerVerificationRouter {
    constructor() {
        this.router = express.Router();
        this.sellerVerificationController = new SellerVerificationController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Route for verifying the seller based on the seller ID passed in the request params
        this.router.get("/:id", (req, res) => this.sellerVerificationController.verifyEmail(req, res));
    }

    getRouter() {
        return this.router;
    }
}

const sellerVerificationRouter = new SellerVerificationRouter();
module.exports = sellerVerificationRouter.getRouter();
