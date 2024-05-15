const { test, after, describe, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("node:assert");
const api = supertest(app);

describe.only("User creation", () => {
  test.only("should create a new user with valid data", async () => {
    const response = await api
      .post("/api/users")
      .send({
        username: "testuser",
        password: "password123",
        name: "Test User",
      })
      .expect(201);

    assert.equal(response.body.message, "User created successfully!");
  });

  test.only("should return 400 for missing username", async () => {
    const response = await api
      .post("/api/users")
      .send({ password: "password123", name: "Test User" })
      .expect(400);
    assert.match(response.body.message, /Username and password/);
  });

  test.only("should return 400 for missing password", async () => {
    const response = await api
      .post("/api/users")
      .send({ username: "testuser", name: "Test User" })
      .expect(400);

    assert.match(response.body.message, /Username and password/);
  });

  test.only("should return 400 for username less than 3 characters", async () => {
    const response = await api
      .post("/api/users")
      .send({ username: "ab", password: "password123", name: "Test User" })
      .expect(400);

    assert.match(response.body.message, /Username and password/);
  });
});

after(async () => {
  await mongoose.connection.close();
});
