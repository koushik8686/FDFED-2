const express = require('express');
const AdminController = require('../../controllers/admin/deleteitem,'); 

class AdminRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/:type/:id", (req, res) => AdminController.deleteItem(req, res));
  }
}

module.exports = new AdminRouter().router;
