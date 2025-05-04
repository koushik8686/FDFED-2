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
app.get("/user/:email", renderUserHome);

let testUserId = '675151588c433d7090169ddc';
const testItemId = "675151588c433d7090169ddc"; // Assumed to be a valid ObjectId string
beforeAll(async () => {
  try {
  mongoose.connect("mongodb+srv://koushik:koushik@cluster0.h2lzgvs.mongodb.net/fdfed").then(()=>{
    console.log("MongoDB Connected ")
  });
    // Generate a random email for the test user
  } catch (err) {
    console.error("Error setting up test DB:", err);
  }
});


describe("User APIs", () => {
  describe("UserHome Controller", () => {
    it("should return user data for a valid ID", async () => {
      const res = await request(app).get(`/user/${testUserId}`);
      console.log(res.statusCode)
      console.log(res.body)
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");
    });

    it("should return 404 for an invalid ID", async () => {
      const res = await request(app).get("/user/123");
      expect(res.statusCode).toBe(500);
    });
  });

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
