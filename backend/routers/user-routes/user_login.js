//user_login.js
const express = require('express');
const UserController = require("../../controllers/user/user_login");
const { loguserActions, userErrorMiddleware } = require('../../middleware/User');

const router = express.Router();

router.post("/", loguserActions, userErrorMiddleware, UserController.userlogin_post);

module.exports = router;
