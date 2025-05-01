const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const LikedRoutes = require("../routers/user-routes/LikedRoutes");
const authRouter = require("../routers/user-routes/authrouter");
const userRegisterRouter = require("../routers/user-routes/user_register");
const userLoginRouter = require("../routers/user-routes/user_login");
const { renderUserHome } = require("../controllers/user/user_home");
const usermodel = require("../models/usermodel");

const app = express();
app.use(express.json());
app.use("/liked", LikedRoutes);
app.use("/auth", authRouter);
app.use("/register", userRegisterRouter);
app.use("/login", userLoginRouter);
app.get("/user/:id", renderUserHome);

let testUserId = null;
let testItemId = "675060600b24649c84d1e8a3"; // Sample item ID for testing

beforeAll(async () => {
  await mongoose.connect("mongodb+srv://koushik:koushik@cluster0.h2lzgvs.mongodb.net/fdfed", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  });

  // Create a test user
  const res = await request(app).post("/register").send({
    username: "testuser",
    email: "testuser@example.com",
    password: "Test@1234",
  });
  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe("Verification Email Sent To Your Email");

  const user = await usermodel.findOne({ email: "testuser@example.com" });
  testUserId = user._id.toString();
});
 
afterAll(async () => {
  // Delete the test user
  if (testUserId) {
    await usermodel.findByIdAndDelete(testUserId);
  }
  await mongoose.connection.close();
});

describe("User APIs", () => {
  // Tests for UserHome Controller
  describe("UserHome Controller", () => {
    it("should return user data for a valid ID", async () => {
      const res = await request(app).get(`/user/${testUserId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");
    });

    it("should return 404 for an invalid ID", async () => {
      const res = await request(app).get("/user/");
      expect(res.statusCode).toBe(404);
    });
  });

  // Tests for LikedItems Controller
  describe("LikedItems Controller", () => {
    it("should add an item to liked items", async () => {
      const res = await request(app).post(`/liked/${testUserId}/${testItemId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Added to Liked items");
    });

    it("should fetch liked items for a valid user ID", async () => {
      const res = await request(app).get(`/liked/${testUserId}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should delete an item from liked items", async () => {
      const res = await request(app).delete(`/liked/${testUserId}/${testItemId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Deleted from Liked items");
    });
  });

  // Tests for GoogleAuth Controller
  describe("GoogleAuth Controller", () => {
    it("should return 500 for invalid tokens", async () => {
      const res = await request(app).get("/auth/google").query({
        tokens: { access_token: "invalid_access_token" },
      });
      expect(res.statusCode).toBe(500);
      expect(res.text).toBe("An error occurred during Google login.");
    });
  });

  // Tests for User Registration
  describe("User Registration", () => {
    it("should not allow duplicate email registration", async () => {
      const res = await request(app).post("/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "Test@1234",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Email Already Exists");
    });
  });

  // Tests for User Login
  describe("User Login", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/login").send({
        email: "testuser@example.com",
        password: "Test@1234",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Login Successfully");
    });

    it("should return error for incorrect password", async () => {
      const res = await request(app).post("/login").send({
        email: "testuser@example.com",
        password: "WrongPassword",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Wrong Password");
    });

    it("should return error for non-existent email", async () => {
      const res = await request(app).post("/login").send({
        email: "nonexistent@example.com",
        password: "Test@1234",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("No Email");
    });
  });
});

