//LikedRoutes.js
const express = require('express');
const LikedController = require('../../controllers/user/LikedItems');
const { loguserActions, userErrorMiddleware } = require('../../middleware/User');

const router = express.Router();

router.get('/:id', loguserActions, userErrorMiddleware, (req, res) => LikedController.getLikedItems(req, res));
router.post('/:userid/:itemid', loguserActions, userErrorMiddleware, (req, res) => LikedController.addLikedItems(req, res));
router.delete('/:userid/:itemid', loguserActions, userErrorMiddleware, (req, res) => LikedController.deleteLikedItems(req, res));

module.exports = router;
