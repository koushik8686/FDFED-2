//authrouter.js
const express = require('express');
const { googleLogin } = require('../../controllers/user/googleauth');
const { loguserActions, userErrorMiddleware } = require('../../middleware/User');

const authRouter = express.Router();

authRouter.get('/google', loguserActions, userErrorMiddleware, googleLogin);

module.exports = authRouter;
