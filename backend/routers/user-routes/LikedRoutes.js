const express = require('express');
const LikedController = require('../../controllers/user/LikedItems');
const {loguserActions , userErrorMiddleware} = require('../../middleware/User')

class AuthRouter {
    constructor() {
        this.router = express.Router();
        this.LikedController = new LikedController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/:id', loguserActions , userErrorMiddleware,  (req, res) => this.LikedController.getLikedItems(req, res));
        this.router.post('/:userid/:itemid',  loguserActions , userErrorMiddleware , (req, res) => this.LikedController.addlikedItems(req, res));
        this.router.delete('/:userid/:itemid', loguserActions , userErrorMiddleware, (req, res) => this.LikedController.deleteLikedItems(req, res));
    }

    getRouter() {
        return this.router;
    }
}

const authRouter = new AuthRouter();
module.exports = authRouter.getRouter();