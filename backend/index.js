const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const multer = require("multer");
require('dotenv').config();
const cookieParser = require("cookie-parser");
const { itemmodel } = require("./models/itemmodel");
const FeedBack= require('./models/FeedBackModel')
const app = express();
const nodemailer = require('nodemailer');
const email = "hexart637@gmail.com";
const morgan = require('morgan');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email, // Replace with your email
    pass: 'zetk dsdm imvx keoa', // Replace with your app password
  },
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//Inbuilt middleware
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect("mongodb+srv://koushik:koushik@cluster0.h2lzgvs.mongodb.net/fdfed").then(()=>{
  console.log("MongoDB Connected ")
});
app.use(express.json()); // To parse JSON body


//Third party middleware
morgan.token('body', (req) => JSON.stringify(req.body)); // Logs request body
morgan.token('response-time-ms', (req, res) => `${res.getHeader('X-Response-Time') || 'N/A'}ms`);
app.use(
  morgan(':method :url :status :response-time ms - :body')
);
app.use(cors())
app.listen(4000, function (param) { console.log("Running on port 4000"); console.log("http://localhost:4000/"); })

app.delete('/item/:id', function (req, res) {
  itemmodel.findbyIdAndDelete(req.params.id).then(()=>{
    res.status(200).send({message:"Item deleted successfully"});
  })
})
app.post('/feedback', async (req, res) => {
  const { name, email, feedback, rating } = req.body;
  try {
    // Save Feedback to DB
    const newFeedback = new FeedBack({
      name,
      email,
      Feedback: feedback,
      Rating: rating,
      CreatedAt: new Date(),
    });
    await newFeedback.save();

    // Send Email Notification
    const mailOptions = {
      from: email, // Replace with your email
      to: 'pinnukoushikp@gmail.com',
      subject: 'New Feedback Received',
      text: `
          You have received new feedback:
          ---------------------------------------
          Name: ${name}
          Email: ${email}
          Feedback: ${feedback}
          Rating: ${rating}/5
          ---------------------------------------
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Feedback saved and email sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});
app.get('/feedbacks', function (req, res) {
  FeedBack.find().then(feedbacks => {
    res.json(feedbacks);
  }).catch(err => {
    res.status(500).json({ error: 'An error occurred while retrieving feedbacks.' });
  });
})

//user routes

app.get("/", function (req, res) { console.log(req.headers.host);  res.send("hello welcome to hexart")})
app.use("/register", require("./routers/user-routes/user_register"))
app.use("/login",require("./routers/user-routes/user_login"))
app.use("/user", require("./routers/user-routes/user_home") )
app.use("/auction", require("./routers/user-routes/user_auctionpage")) //auction page for users
app.use("/auth", require("./routers/user-routes/authrouter"))
app.use("/verify" , require("./routers/user-routes/verifymail"))
app.use("/liked", require("./routers/user-routes/LikedRoutes"))
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


app.post('/item/unsold/:id', async (req, res) => {
  itemmodel.findByIdAndUpdate(req.params.id, { aution_active: false });
  res.status(200).send({ message: `Item ${req.params.id} marked as unsold` });
})