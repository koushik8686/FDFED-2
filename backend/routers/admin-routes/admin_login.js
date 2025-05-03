const express = require("express");
const AdminController = require("../../controllers/admin/admin_login");
const { logAdminActions, AdminErrorMiddleware } = require("../../middleware/Admin");

const router = express.Router();

router.post("/", logAdminActions, AdminErrorMiddleware, AdminController.login);

module.exports = router;
