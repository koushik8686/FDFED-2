const express = require("express");
const request = require("supertest");
const adminLoginRouter = require("../routers/admin-routes/admin_login");
const adminHomeRouter = require("../routers/admin-routes/admin_home");

const app = express();
app.use(express.json());
app.use("/admin/login", adminLoginRouter);
app.use("/admin", adminHomeRouter);

describe("Admin Routes", () => {
  test("POST /admin/login - correct credentials", async () => {
    const res = await request(app).post("/admin/login").send({
      email: "pinnukoushikp@gmail.com",
      password: "Koushik@2004",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login Successfully");
    expect(res.body.admin).toBe("admin_id_12345");
  });

  test("POST /admin/login - wrong credentials", async () => {
    const res = await request(app).post("/admin/login").send({
      email: "wrong@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });


});
