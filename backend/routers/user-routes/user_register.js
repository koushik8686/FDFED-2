const express = require('express')
const router = express.Router()
const {userregister_get,userregister_post } = require("../../controllers/user/user_register")

router.post("/", userregister_post)
      
module.exports= router