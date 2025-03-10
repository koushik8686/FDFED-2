const express = require('express');
const AdminController = require('../../controllers/admin/admin_homepage'); 
const {logAdminActions , AdminErrorMiddleware} = require("../../middleware/Admin")

class AdminRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", logAdminActions , AdminErrorMiddleware, (req, res) => AdminController.adminPageGet(req, res));
  }
}

module.exports = new AdminRouter().router;
