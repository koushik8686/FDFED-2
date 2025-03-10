const express = require('express')
const router = express.Router()
const SellerLoginController = require("../../controllers/seller/seller_login")
const {logSellerActions , sellerErrorMiddleware} = require('../../middleware/Seller')

class SelllerLoginRoute {
       constructor(){
           this.router = express.Router()
           this.initializeRoutes()
       }
       initializeRoutes(){
           this.router.post("/", logSellerActions , sellerErrorMiddleware,SellerLoginController.sellerlogin_post)
       }
       getRouter(){
           return this.router
       }
}

module.exports= new SelllerLoginRoute().getRouter()