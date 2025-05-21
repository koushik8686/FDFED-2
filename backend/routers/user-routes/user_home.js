//user_home.js
const express = require('express');
const UserController = require("../../controllers/user/user_home");
const { loguserActions, userErrorMiddleware } = require('../../middleware/User');

const router = express.Router();

router.get("/:id", loguserActions, userErrorMiddleware, UserController.renderUserHome);

module.exports = router;
