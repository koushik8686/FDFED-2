const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const multer = require("multer");
require('dotenv').config();
const cookieParser = require("cookie-parser");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/auction");

app.use(cors({origin:'http://localhost:3000'}))
app.options('*', cors()); // Enable pre-flight requests for all routes

app.listen(4000, function (param) { console.log("Running on port 4000"); console.log("http://localhost:4000/"); })

//user routes
app.get("/", function (req, res) { console.log(req.headers.host);  res.send("hello welcome to hexart")})
app.use("/register", require("./routers/user-routes/user_register"))
app.use("/login",require("./routers/user-routes/user_login"))
app.use("/user", require("./routers/user-routes/user_home") )
app.use("/auction", require("./routers/user-routes/user_auctionpage")) //auction page for users
app.use("/auth", require("./routers/user-routes/authrouter"))
app.use("/verify" , require("./routers/user-routes/verifymail"))

//seller routes
app.get("/seller", function (req, res) {  res.sendFile(__dirname+"/views/sellerintro.html")})
app.use("/sellerregister", require("./routers/seller-routes/seller_register") )
app.use("/sellerlogin",require("./routers/seller-routes/seller_login") )
app.use("/sellerhome",require("./routers/seller-routes/seller_home"))
app.use("/create", require("./routers/seller-routes/create_auction") )
app.use("/sell",require("./routers/seller-routes/sell_item")) //route for owner of the item
app.use("/seller/auth", require("./routers/user-routes/authrouter"))
app.use("/seller/verify" , require("./routers/seller-routes/sellerverification"))


//admin 
app.use("/admin/login",require("./routers/admin-routes/admin_login"))
app.use("/admin/home",require("./routers/admin-routes/admin_home"))
app.use("/delete" ,require("./routers/admin-routes/deleteitem") )
