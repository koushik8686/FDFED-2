const express = require('express')
const router = express.Router()
const SellerController  = require("../../controllers/seller/seller_register")


class SellerRouter{
       constructor(){
           this.router = express.Router()
           this.initializeRoutes()
       }
       initializeRoutes(){
           this.router.post("/", SellerController.sellerregister_post)
       }
       getRouter(){
           return this.router
       }
}

const sellerRouter = new SellerRouter();
module.exports = sellerRouter.getRouter();