const express = require('express');
const AdminController = require('../../controllers/admin/admin_homepage'); 
const { logAdminActions, AdminErrorMiddleware } = require("../../middleware/Admin");

const router = express.Router();

router.get("/", logAdminActions, AdminErrorMiddleware, AdminController.adminPageGet);

module.exports = router;
