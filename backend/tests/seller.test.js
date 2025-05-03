const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const create_auction = require("../routers/seller-routes/create_auction");
const sell_item = require("../routers/seller-routes/sell_item");
const seller_home = require("../routers/seller-routes/seller_home");
const seller_login = require("../routers/seller-routes/seller_login");
const seller_register = require("../routers/seller-routes/seller_register");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use imported routers
app.use("/seller/register", seller_register);
app.use("/seller/login", seller_login);
app.use("/seller/home", seller_home);
app.use("/seller/sell", sell_item);
app.use("/seller/auction", create_auction);

// Import models
const Seller = require("../../models/sellerModel");
const Item = require("../../models/itemModel");

let testSellerId = null;
let testItemId = null;

beforeAll(async () => {
  await mongoose.connect("mongodb+srv://koushik:koushik@cluster0.h2lzgvs.mongodb.net/fdfed", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  });

  // Create test seller
  const seller = await Seller.create({ 
    name: "Test Seller", 
    email: "test@seller.com",
    password: "Test@1234" 
  });
  testSellerId = seller._id.toString();

  // Create test item
  const item = await Item.create({ 
    name: "Test Item", 
    price: 100, 
    sellerId: testSellerId 
  });
  testItemId = item._id.toString();
});

afterAll(async () => {
  if (testItemId) await Item.findByIdAndDelete(testItemId);
  if (testSellerId) await Seller.findByIdAndDelete(testSellerId);
  await mongoose.connection.close();
});

describe("Seller APIs", () => {
  describe("Seller Registration", () => {
    it("should register a new seller successfully", async () => {
      const res = await request(app).post("/seller/register").send({
        name: "New Seller",
        email: "newseller@example.com",
        password: "NewSeller@1234",
      });
      expect(res.statusCode).toBe(200);

      // Cleanup
      const seller = await Seller.findOne({ email: "newseller@example.com" });
      if (seller) await Seller.findByIdAndDelete(seller._id);
    });

    it("should not allow duplicate email registration", async () => {
      const res = await request(app).post("/seller/register").send({
        name: "Test Seller",
        email: "test@seller.com",
        password: "Test@1234",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Email Already Exists");
    });
  });

  describe("Seller Login", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/seller/login").send({
        email: "test@seller.com",
        password: "Test@1234",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Login Successfully");
    });

    it("should return error for incorrect password", async () => {
      const res = await request(app).post("/seller/login").send({
        email: "test@seller.com",
        password: "WrongPassword",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Wrong Password");
    });
  });

  describe("Seller Home", () => {
    it("should return seller data for a valid ID", async () => {
      const res = await request(app).get(`/seller/home/${testSellerId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");
    });

    it("should return 404 for an invalid ID", async () => {
      const res = await request(app).get("/seller/home/invalidId");
      expect(res.statusCode).toBe(404);
    });
  });

  describe("Sell Item", () => {
    it("should render the selling page", async () => {
      const res = await request(app).get(`/seller/sell/${testSellerId}/${testItemId}`);
      expect(res.statusCode).toBe(200);
    });

    it("should post an item for sale", async () => {
      const res = await request(app).post(`/seller/sell/${testSellerId}/${testItemId}`).send({
        price: 100,
        description: "Test Item Description",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Item Posted Successfully");
    });
  });

  describe("Create Auction", () => {
    it("should create a new auction", async () => {
      const res = await request(app)
        .post(`/seller/auction/${testSellerId}`)
        .attach("image", Buffer.from("test image"), "test.jpg")
        .field("title", "Test Auction")
        .field("startingBid", 100);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Auction Created Successfully");
    });
  });
});