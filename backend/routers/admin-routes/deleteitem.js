const express = require('express');
const AdminController = require('../../controllers/admin/deleteitem,'); 
const { logAdminActions, AdminErrorMiddleware } = require("../../middleware/Admin");

const router = express.Router();

router.get("/:type/:id", logAdminActions, AdminErrorMiddleware, AdminController.deleteItem);

module.exports = router;
