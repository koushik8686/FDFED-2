const express = require('express');
const UserVerificationController = require('../../controllers/user/verifyemail');

class VerificationRouter {
    constructor() {
        this.router = express.Router();
        this.userVerificationController = new UserVerificationController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Route for verifying the user based on the email ID passed in the request params
        this.router.get("/:id", (req, res) => this.userVerificationController.verifyEmail(req, res));
    }

    getRouter() {
        return this.router;
    }
}

const verificationRouter = new VerificationRouter();
module.exports = verificationRouter.getRouter();
