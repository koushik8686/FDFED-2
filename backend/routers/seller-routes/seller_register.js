const express = require('express')
const router = express.Router()
const SellerController  = require("../../controllers/seller/seller_register")
const {logSellerActions , sellerErrorMiddleware} = require('../../middleware/Seller')


class SellerRouter{
       constructor(){
           this.router = express.Router()
           this.initializeRoutes()
       }
       initializeRoutes(){
           this.router.post("/", logSellerActions , sellerErrorMiddleware,SellerController.sellerregister_post)
       }
       getRouter(){
           return this.router
       }
}

const sellerRouter = new SellerRouter();
module.exports = sellerRouter.getRouter();