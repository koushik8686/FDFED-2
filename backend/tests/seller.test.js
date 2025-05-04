const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const sellerRegisterRouter = require('../routers/seller-routes/seller_register');
const sellerLoginRouter = require('../routers/seller-routes/seller_login');
const sellerHomeRouter = require('../routers/seller-routes/seller_home');
const sellItemRouter = require('../routers/seller-routes/sell_item');
const createAuctionRouter = require('../routers/seller-routes/create_auction');
const { itemmodel } = require('../models/itemmodel');

// Initialize the app and use seller routers
const app = express();
app.use(express.json());
app.use('/seller/register', sellerRegisterRouter);
app.use('/seller/login', sellerLoginRouter);
app.use('/seller/home', sellerHomeRouter);
app.use('/seller/sell-item', sellItemRouter);
app.use('/seller/create-auction', createAuctionRouter);

beforeAll(async () => {
    // Connect to the test database
    const url = `mongodb://127.0.0.1/seller_test_db`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    // Clean up and disconnect
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Seller Routes and Controllers', () => {
    let sellerId, itemId;

    test('POST /seller/register - Register a new seller', async () => {
        const response = await request(app)
            .post('/seller/register')
            .send({
                name: 'Test Seller',
                email: 'testseller@example.com',
                phone: '1234567890',
                password: 'password123'
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Verification Email Sent To Your Email');
    });

    test('POST /seller/login - Login a seller', async () => {
        const response = await request(app)
            .post('/seller/login')
            .send({
                email: 'testseller@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login Successfully');
        sellerId = response.body.sellerId;
    });

    test('GET /seller/home/:id - Fetch seller home data', async () => {
        const response = await request(app).get(`/seller/home/${sellerId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Data Fetched Successfully');
        expect(response.body.data.seller._id).toBe(sellerId);
    });

    test('POST /seller/create-auction/:seller - Create a new auction', async () => {
        const response = await request(app)
            .post(`/seller/create-auction/${sellerId}`)
            .field('name', 'Test Item')
            .field('basePrice', 100)
            .field('type', 'Electronics')
            .field('date', '2023-12-01')
            .field('StartTime', '10:00')
            .field('EndTime', '12:00')
            .attach('image', '__tests__/test-image.jpg'); // Assuming a test image exists
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Item created successfully');
    });

    test('GET /seller/sell-item/:seller/:itemid - Fetch item details for selling', async () => {
        const item = await itemmodel.findOne({ name: 'Test Item' });
        itemId = item._id;
        const response = await request(app).get(`/seller/sell-item/${sellerId}/${itemId}`);
        expect(response.status).toBe(200);
        expect(response.body.data.item.name).toBe('Test Item');
    });


});
