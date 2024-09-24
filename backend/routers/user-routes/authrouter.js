const express = require('express');
const GoogleAuthController = require('../../controllers/user/googleauth');

class AuthRouter {
    constructor() {
        this.router = express.Router();
        this.googleAuthController = new GoogleAuthController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/google', (req, res) => this.googleAuthController.googleLogin(req, res));
    }

    getRouter() {
        return this.router;
    }
}

const authRouter = new AuthRouter();
module.exports = authRouter.getRouter();