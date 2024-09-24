const express = require('express');
const UserController = require("../../controllers/user/user_login");

class UserRouter {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/", UserController.userlogin_post);
    }
    getRouter() {
        return this.router;
    }
}

const userRouter = new UserRouter();
module.exports = userRouter.getRouter();