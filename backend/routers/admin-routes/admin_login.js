const express = require("express");
const AdminController = require("../../controllers/admin/admin_login");
const {logAdminActions , AdminErrorMiddleware} = require("../../middleware/Admin")

class AdminRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", logAdminActions , AdminErrorMiddleware, AdminController.login);
  }
}

module.exports = new AdminRouter().router;
