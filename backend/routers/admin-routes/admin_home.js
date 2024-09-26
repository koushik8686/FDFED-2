const express = require('express');
const AdminController = require('../../controllers/admin/admin_homepage'); 

class AdminRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", (req, res) => AdminController.adminPageGet(req, res));
  }
}

module.exports = new AdminRouter().router;
