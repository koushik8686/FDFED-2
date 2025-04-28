const express = require('express');
const SellerVerificationController = require('../../controllers/seller/verifyemail');
const { logSellerActions, sellerErrorMiddleware } = require('../../middleware/Seller');

const router = express.Router();

// Route for verifying the seller based on the seller ID passed in the request params
router.get("/:id", logSellerActions, sellerErrorMiddleware, (req, res) => {
  return SellerVerificationController.verifyEmail(req, res);
});

module.exports = router;
