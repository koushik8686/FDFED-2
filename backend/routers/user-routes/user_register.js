const express = require('express');
const UserController = require("../../controllers/user/user_register");

class UserRouter {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/", UserController.userregister_post);
    }
    getRouter() {
        return this.router;
    }
}

const userRouter = new UserRouter();
module.exports = userRouter.getRouter();