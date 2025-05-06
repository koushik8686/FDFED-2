const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");

const LikedRoutes = require("../routers/user-routes/LikedRoutes");
const authRouter = require("../routers/user-routes/authrouter");
const userRegisterRouter = require("../routers/user-routes/user_register");
const userLoginRouter = require("../routers/user-routes/user_login");
const { renderUserHome } = require("../controllers/user/user_home");
const usermodel = require("../models/usermodel");
jest.setTimeout(20000); // sets timeout to 20 seconds

const app = express();
app.use(express.json());
app.use("/liked", LikedRoutes);
app.use("/auth", authRouter);
app.use("/register", userRegisterRouter);
app.use("/login", userLoginRouter);
app.get("/user/:id", renderUserHome);

// Test credentials
function generateTestUser() {
  const randomSuffix = Math.floor(Math.random() * 1000000);
  return {
    username: `jestuser_${randomSuffix}`,
    email: `jestuser_${randomSuffix}@example.com`,
    password: "Test@1234", // Keep static or randomize if needed
  };
}

const testUser = generateTestUser();
beforeAll(async () => {
  try {
    await mongoose.connect("mongodb+srv://koushik:koushik@cluster0.h2lzgvs.mongodb.net/test_wbd", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error("DB connection error:", err);
  }
});

describe("User APIs", () => {
  describe("User Registration", () => {
    it("should register a new user", async () => {
      const newUser = {
        username: "jestuser_" + Date.now(), // makes the username unique
        email: `jestuser_${Date.now()}@example.com`, // ensures unique email
        password: "Test@1234"
      };
  
      const res = await request(app).post("/register").send(newUser);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Registration Successful");
    });
  
    it("should not allow duplicate email registration", async () => {
      const duplicateUser = {
        username: "existinguser",
        email: "jestduplicate@example.com",
        password: "Test@1234"
      };
  
      // First register
      await request(app).post("/register").send(duplicateUser);
  
      // Try again
      const res = await request(app).post("/register").send(duplicateUser);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Email Already Exists");
    });
  });
  

  describe("User Login", () => {
    it("should login successfully with correct credentials", async () => {
      // Register the test user first
      await request(app).post("/register").send(testUser);

      const res = await request(app).post("/login").send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Login Successfully");
      expect(res.body).toHaveProperty("userId");
      testUser._id = res.body.userId; // Save userId for subsequent tests
    });

    it("should return error for incorrect password", async () => {
      const res = await request(app).post("/login").send({
        email: testUser.email,
        password: "WrongPassword",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Wrong Password");
    });

    it("should return error for non-existent email", async () => {
      const res = await request(app).post("/login").send({
        email: "nonexistent@example.com",
        password: testUser.password,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("No Email");
    });
  });

  describe("User Home", () => {
    it("should return user data for a valid user ID", async () => {
      const res = await request(app).get(`/user/${testUser._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");
    });

    it("should return error for invalid user ID", async () => {
      const res = await request(app).get(`/user/invalid_user_id`);
      expect(res.statusCode).toBe(500); // Or 404 depending on your controller
    });
  });
});



afterAll(async () => {
  // Clean up the entire collection
  await usermodel.deleteMany({});
  await mongoose.disconnect();
});
