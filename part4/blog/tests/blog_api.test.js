const { test, after, beforeEach } = require("node:test");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const assert = require("node:assert");

const api = supertest(app);

test.only("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test.only("there are two blogs", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, 2);
});

test.only("the first blog is about React patterns", async () => {
  const response = await api.get("/api/blogs");

  const contents = response.body.map((e) => e.title);
  // is the argument truthy
  assert(contents.includes("React patterns"));
});

after(async () => {
  await mongoose.connection.close();
});
