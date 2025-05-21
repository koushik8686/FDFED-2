//user_auctionpage.js
const express = require('express');
const UserAuctionController = require("../../controllers/user/user_auction_page");
const { loguserActions, userErrorMiddleware } = require('../../middleware/User');

const router = express.Router();

router.get("/:userid/item/:itemid", loguserActions, userErrorMiddleware, UserAuctionController.renderAuctionPage);
router.post("/:userid/item/:itemid", loguserActions, userErrorMiddleware, UserAuctionController.bid);

module.exports = router;
