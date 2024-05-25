/*const { test, describe, beforeEach, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { User } = require("../models/models");
const assert = require("node:assert");

const api = supertest(app);

describe("Login and Token Authentication", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await User.hashPassword("password");
    const user = new User({
      username: "testuser",
      name: "Test User",
      passwordHash,
    });
    await user.save();
  });

  test("login succeeds with valid credentials", async () => {
    const loginData = {
      username: "testuser",
      password: "password",
    };

    const response = await api
      .post("/api/login")
      .send(loginData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert(response.body.token);
    assert(response.body.username === "testuser");
  });

  test("login fails with invalid credentials", async () => {
    const loginData = {
      username: "testuser",
      password: "wrongpassword",
    };

    const response = await api
      .post("/api/login")
      .send(loginData)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error === "invalid username or password");
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
*/
