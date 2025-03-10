const express = require('express');
const UserController = require("../../controllers/user/user_home");
const {loguserActions , userErrorMiddleware} = require('../../middleware/User')

class UserRouter {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/:email",   loguserActions , userErrorMiddleware,UserController.renderUserHome);
    }

    getRouter() {
        return this.router;
    }
}

const userRouter = new UserRouter();
module.exports = userRouter.getRouter();