const express = require('express');
const UserController = require("../../controllers/user/user_register");
const { loguserActions, userErrorMiddleware } = require('../../middleware/User');

// Create a router instance
const router = express.Router();

// Define routes
router.post("/", loguserActions, userErrorMiddleware, UserController.userregister_post);

// Export the router
module.exports = router;