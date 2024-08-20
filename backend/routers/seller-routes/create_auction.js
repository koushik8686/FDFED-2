const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');
const { createauction_get, createauction_post } = require("../../controllers/seller/create_auction");
const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../uploads")); // Correctly resolve the directory path
      },
      filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`); // Generate a unique file name with the current timestamp
      },
    });
    
const upload = multer({ storage: storage });

router.get("/:seller", createauction_get)
      .post("/:seller", upload.single('image'), createauction_post);

module.exports = router;
