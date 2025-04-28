const express = require('express');
const SellingController = require("../../controllers/seller/sell_item");
const { logSellerActions, sellerErrorMiddleware } = require('../../middleware/Seller');

const router = express.Router();

router.get("/:seller/:itemid", logSellerActions, sellerErrorMiddleware, SellingController.sellingPageGet);
router.post("/:seller/:itemid", logSellerActions, sellerErrorMiddleware, SellingController.sellingPagePost);

module.exports = router;
