const express = require('express');
const AdminController = require('../../controllers/admin/deleteitem,'); 
const {logAdminActions , AdminErrorMiddleware} = require("../../middleware/Admin")

class AdminRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/:type/:id", logAdminActions , AdminErrorMiddleware, (req, res) => AdminController.deleteItem(req, res));
  }
}

module.exports = new AdminRouter().router;
