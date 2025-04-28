const express = require('express');
const SellerController = require("../../controllers/seller/seller_register");
const { logSellerActions, sellerErrorMiddleware } = require('../../middleware/Seller');

const router = express.Router();

router.post("/", logSellerActions, sellerErrorMiddleware, SellerController.sellerregister_post);

module.exports = router;