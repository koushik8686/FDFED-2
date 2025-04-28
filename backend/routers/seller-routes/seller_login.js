const express = require('express');
const SellerLoginController = require("../../controllers/seller/seller_login");
const { logSellerActions, sellerErrorMiddleware } = require('../../middleware/Seller');

const router = express.Router();

router.post("/", logSellerActions, sellerErrorMiddleware, SellerLoginController.sellerlogin_post);

module.exports = router;