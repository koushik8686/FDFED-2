const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");



// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import controllers

// Routes
app.get("/sellers", getAllSellers);
app.get("/sellers/:id", getSellerById);
app.post("/sellers", createSeller);
app.put("/sellers/:id", updateSeller);
app.delete("/sellers/:id", deleteSeller);

app.get("/items", getAllItems);
app.get("/items/:id", getItemById);
app.post("/items", createItem);
app.put("/items/:id", updateItem);
app.delete("/items/:id", deleteItem);

app.use('/sellers', require('./routers/seller-routes/seller_login'));
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
  describe("Seller CRUD Operations", () => {
    it("should fetch all sellers", async () => {
      const res = await request(app).get("/sellers");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ _id: testSellerId })
        ])
      );
    });

    it("should fetch a specific seller", async () => {
      const res = await request(app).get(`/sellers/${testSellerId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({ 
          _id: testSellerId, 
          name: "Test Seller" 
        })
      );
    });

    it("should create a new seller", async () => {
      const newSellerData = { 
        name: "New Seller", 
        email: "new@seller.com",
        password: "Test@1234"
      };
      const res = await request(app).post("/sellers").send(newSellerData);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          name: newSellerData.name,
          email: newSellerData.email
        })
      );

      await Seller.findByIdAndDelete(res.body._id);
    });

    it("should update a seller", async () => {
      const updatedData = { name: "Updated Seller" };
      const res = await request(app)
        .put(`/sellers/${testSellerId}`)
        .send(updatedData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining(updatedData)
      );
    });

    it("should delete a seller", async () => {
      const tempSeller = await Seller.create({ 
        name: "Temp Seller", 
        email: "temp@seller.com",
        password: "Test@1234"
      });
      const res = await request(app).delete(`/sellers/${tempSeller._id}`);
      expect(res.statusCode).toBe(200);

      const deletedSeller = await Seller.findById(tempSeller._id);
      expect(deletedSeller).toBeNull();
    });
  });

  describe("Item CRUD Operations", () => {
    it("should fetch all items", async () => {
      const res = await request(app).get("/items");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ _id: testItemId })
        ])
      );
    });

    it("should fetch a specific item", async () => {
      const res = await request(app).get(`/items/${testItemId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({ 
          _id: testItemId, 
          name: "Test Item" 
        })
      );
    });

    it("should create a new item", async () => {
      const newItemData = { 
        name: "New Item", 
        price: 200, 
        sellerId: testSellerId 
      };
      const res = await request(app).post("/items").send(newItemData);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining(newItemData)
      );

      await Item.findByIdAndDelete(res.body._id);
    });

    it("should update an item", async () => {
      const updatedData = { name: "Updated Item", price: 150 };
      const res = await request(app)
        .put(`/items/${testItemId}`)
        .send(updatedData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining(updatedData)
      );
    });

    it("should delete an item", async () => {
      const tempItem = await Item.create({ 
        name: "Temp Item", 
        price: 50, 
        sellerId: testSellerId 
      });
      const res = await request(app).delete(`/items/${tempItem._id}`);
      expect(res.statusCode).toBe(200);

      const deletedItem = await Item.findById(tempItem._id);
      expect(deletedItem).toBeNull();
    });
  });
});