const { test, after, describe } = require("node:test");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const assert = require("node:assert");

const api = supertest(app);

describe.only("GET /api/blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two blogs", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, 2);
  });

  test("the first blog is about React patterns", async () => {
    const response = await api.get("/api/blogs");

    const contents = response.body.map((e) => e.title);
    // is the argument truthy
    assert(contents.includes("React patterns"));
  });

  test("returns list of blogs with id property", async () => {
    const response = await api.get("/api/blogs").expect(200);
    assert.ok(Array.isArray(response.body));

    response.body.forEach((blog) => {
      assert(blog.id !== undefined);
      assert(blog._id === undefined);
    });
  });
});

describe.only("POST /api/blogs", () => {
  test("creates a new blog post", async () => {
    const newBlog = {
      title: "Test Blog Post",
      author: "Jest Tester",
      url: "https://jestjs.io/",
      likes: 0,
    };

    const initialBlogs = await api.get("/api/blogs").expect(200);
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, initialBlogs.body.length + 1);
  });
  test.only("creates a new blog post with default likes", async () => {
    const newBlog = {
      title: "Test Blog Post",
      author: "Jest Tester",
      url: "https://jestjs.io/",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });
});

after(async () => {
  await mongoose.connection.close();
});
