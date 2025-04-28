const express = require('express');
const SellerHomeController = require("../../controllers/seller/seller_home");
const { logSellerActions, sellerErrorMiddleware } = require('../../middleware/Seller');

const router = express.Router();

router.get("/:id", logSellerActions, sellerErrorMiddleware, SellerHomeController.renderSellerHome);

module.exports = router;