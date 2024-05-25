const { test, describe, beforeEach, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const { User, Blog } = require("../models/models");
const assert = require("node:assert");

const api = supertest(app);

describe("Blog creation and population", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    const passwordHash = await bcrypt.hash("password", 10);
    const user = new User({
      username: "testuser",
      name: "Test User",
      passwordHash,
    });
    await user.save();
  });

  test("creates a new blog post and populates the user", async () => {
    const newBlog = {
      title: "Test Blog Post",
      author: "Jest Tester",
      url: "https://jestjs.io/",
      likes: 0,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = response.body.id;
    const blog = await Blog.findById(blogId).populate("user", {
      username: 1,
      name: 1,
    });
    assert.strictEqual(blog.user.username, "testuser");
  });

  test("lists all users with blogs", async () => {
    // Create a blog to ensure there's data for this test
    const newBlog = {
      title: "Another Test Blog Post",
      author: "Jest Tester",
      url: "https://jestjs.io/",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/users").expect(200);
    assert(response.body[0].blogs.length > 0);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
