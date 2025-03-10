const express = require('express');
const UserAuctionController = require("../../controllers/user/user_auction_page");
const {loguserActions , userErrorMiddleware} = require('../../middleware/User')

class UserAuctionRouter {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/:userid/item/:itemid", loguserActions , userErrorMiddleware , UserAuctionController.renderAuctionPage);
        this.router.post("/:userid/item/:itemid",  loguserActions , userErrorMiddleware, UserAuctionController.bid);
    }

    getRouter() {
        return this.router;
    }
}

const userAuctionRouter = new UserAuctionRouter();
module.exports = userAuctionRouter.getRouter();