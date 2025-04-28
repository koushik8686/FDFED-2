const express = require('express');
const UserVerificationController = require('../../controllers/user/verifyemail');
const { loguserActions, userErrorMiddleware } = require('../../middleware/User');

const router = express.Router();
// Route for verifying the user based on the email ID passed in the request params
router.get("/:id", loguserActions, userErrorMiddleware, (req, res) => {
    UserVerificationController.verifyEmail(req, res);
});

module.exports = router;
