const express = require('express');
const LikedController = require('../../controllers/user/LikedItems');

class AuthRouter {
    constructor() {
        this.router = express.Router();
        this.LikedController = new LikedController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/:id', (req, res) => this.LikedController.getLikedItems(req, res));
        this.router.post('/:userid/:itemid', (req, res) => this.LikedController.addlikedItems(req, res));
        this.router.delete('/:userid/:itemid', (req, res) => this.LikedController.deleteLikedItems(req, res));
    }

    getRouter() {
        return this.router;
    }
}

const authRouter = new AuthRouter();
module.exports = authRouter.getRouter();