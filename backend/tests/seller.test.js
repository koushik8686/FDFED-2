const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');

const sellerRegisterRouter = require('../routers/seller-routes/seller_register');
const sellerLoginRouter = require('../routers/seller-routes/seller_login');
const sellerHomeRouter = require('../routers/seller-routes/seller_home');
const sellItemRouter = require('../routers/seller-routes/sell_item');
const createAuctionRouter = require('../routers/seller-routes/create_auction');

const { itemmodel } = require('../models/itemmodel');
const sellermodel = require('../models/sellermodel');

const app = express();
app.use(express.json());
app.use('/seller/register', sellerRegisterRouter);
app.use('/seller/login', sellerLoginRouter);
app.use('/seller/home', sellerHomeRouter);
app.use('/seller/sell-item', sellItemRouter);
app.use('/seller/create-auction', createAuctionRouter);

const testSeller = {
    name: "Test Seller",
    email: "seller.test@example.com",
    phone: "9999999999",
    password: "Test@1234"
};

let sellerId = null;
let itemId = null;

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/wbd", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await sellermodel.deleteMany({ email: testSeller.email });
    await itemmodel.deleteMany({ seller: sellerId });
    await mongoose.connection.close();
});

describe('Seller End-to-End Flow', () => {

    test('POST /seller/register - should register a new seller', async () => {
        const res = await request(app).post('/seller/register').send(testSeller);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Verification Email Sent To Your Email");
    });

    test('POST /seller/login - should login seller', async () => {
        const res = await request(app).post('/seller/login').send({
            email: testSeller.email,
            password: testSeller.password
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Login Successfully");
        expect(res.body.sellerId).toBeDefined();
        sellerId = res.body.sellerId;
    });

    test('Add an item directly to DB for testing sell-item route', async () => {
        const item = new itemmodel({
            name: "Test Item",
            price: 300,
            seller: sellerId
        });
        const saved = await item.save();
        itemId = saved._id.toString();
        expect(saved.name).toBe("Test Item");
    });

    test('GET /seller/home/:id - should return seller home data', async () => {
        const res = await request(app).get(`/seller/home/${sellerId}`);
        expect(res.status).toBe(200);
        expect(res.body.data.seller._id).toBe(sellerId);
    });

    test('GET /seller/sell-item/:seller/:itemid - should return item data', async () => {
        const res = await request(app).get(`/seller/sell-item/${sellerId}/${itemId}`);
        expect(res.status).toBe(200);
        expect(res.body.data.item.name).toBe("Test Item");
    });

    // Uncomment if auction logic is implemented
    // test('POST /seller/create-auction/:seller - should create auction', async () => {
    //     const res = await request(app).post(`/seller/create-auction/${sellerId}`).send({
    //         itemName: "Test Item",
    //         startingPrice: 500
    //     });
    //     expect(res.status).toBe(200);
    //     expect(res.body.message).toBe("Auction created successfully");
    // });
});
