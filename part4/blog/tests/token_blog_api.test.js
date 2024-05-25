const { test, describe, beforeEach, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { Blog, User } = require("../models/models");
const assert = require("node:assert");

const api = supertest(app);

describe("Blog creation and population", () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    const passwordHash = await bcrypt.hash("password", 10);
    const user = new User({
      username: "testuser",
      name: "Test User",
      passwordHash,
    });
    const savedUser = await user.save();

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    };

    token = jwt.sign(userForToken, process.env.SECRET);
  });

  test("creates a new blog post and populates the user", async () => {
    const newBlog = {
      title: "Test Blog Post",
      author: "Jest Tester",
      url: "https://jestjs.io/",
      likes: 0,
    };

    // Make a request to your login endpoint to get a token
    const loginResponse = await api
      .post("/api/login")
      .send({ username: "testuser", password: "password" });

    console.log("Login Response:", loginResponse.body); // Check the entire login response body

    // Extract the token from the login response
    const token = loginResponse.body.token;

    console.log("Token:", token); // Check the extracted token

    // Use the token in your request to create a new blog post
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog);

    console.log("Response status:", response.status); // Check the response status code
    console.log("Response body:", response.body); // Check the response body for any error messages

    assert.equal(response.status, 201);
    assert.ok(response.body.hasOwnProperty("id"));

    const blogId = response.body.id;
    const blog = await Blog.findById(blogId).populate("user", {
      username: 1,
      name: 1,
    });
    assert.equal(blog.user.username, "testuser");
  });

  test("lists all users with blogs", async () => {
    const newBlog = {
      title: "Test Blog Post",
      author: "Jest Tester",
      url: "https://jestjs.io/",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/users").expect(200);
    assert(response.body[0].blogs.length > 0);
  });

  test("fails to create a new blog post without token", async () => {
    const newBlog = {
      title: "Test Blog Post",
      author: "Jest Tester",
      url: "https://jestjs.io/",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
