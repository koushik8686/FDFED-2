const express = require("express");
const AdminController = require("../../controllers/admin/admin_login");

class AdminRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", AdminController.login);
  }
}

module.exports = new AdminRouter().router;
