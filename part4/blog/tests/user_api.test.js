const request = require("supertest");
const app = require("../app");
const { test, after, describe } = require("node:test");
const supertest = require("supertest");
const assert = require("node:assert");
const mongoose = require("mongoose");

const api = supertest(app);

describe("User creation restrictions", () => {
  test("Username and password must be at least 3 characters long", async () => {
    const response = await api
      .post("/api/users")
      .send({ username: "ab", password: "ab" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
    assert.equal(
      response.body.error,
      "Username and password must be at least 3 characters long."
    );
  });

  test("Username must be unique", async () => {
    const response = await api
      .post("/api/users")
      .send({ username: "hellas", password: "password", name: "Arto Hellas" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
    assert.equal(response.body.error, "Username must be unique.");
  });
});

after(async () => {
  await mongoose.connection.close();
});
