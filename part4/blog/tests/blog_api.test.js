const { test, after, describe, beforeEach } = require("node:test");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const assert = require("node:assert");

const api = supertest(app);

describe("GET /api/blogs", () => {
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

describe("POST /api/blogs", () => {
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

  test("creates a new blog post with default likes", async () => {
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

  test("responds with 400 if title is missing", async () => {
    const newBlog = {
      author: "Jest Tester",
      url: "https://jestjs.io/",
    };

    const response = await api.post("/api/blogs").send(newBlog).expect(400);

    assert("error" in response.body);
  });

  test("responds with 400 if url is missing", async () => {
    const newBlog = {
      title: "Test Blog Post",
      author: "Jest Tester",
    };

    const response = await api.post("/api/blogs").send(newBlog).expect(400);

    assert("error" in response.body);
  });
});

describe("DELETE /api/blogs/:id", () => {
  test("returns 404 for non-existent blog post", async () => {
    const nonExistentId = "invalid-blog-id";
    await api.delete(`/api/blogs/${nonExistentId}`).expect(404);
  });

  test("deletes a blog post and returns 204", async () => {
    const newBlog = {
      title: "Test Blog Post",
      author: "Jest Tester",
      url: "https://jestjs.io/",
      likes: 0,
      _id: uuid.v4(),
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    let createdBlogId, createdBlog;
    try {
      createdBlog = Blog.findOne({ title: newBlog.title });
    } catch (error) {
      console.error("Error creating blog post:", error);
      // Handle errors appropriately (consider failing the test)
      return; // Exit the test if creation fails
    }
    createdBlogId = createdBlog._id;
    try {
      await api.delete(`/api/blogs/${createdBlogId}`).expect(204);
    } catch (error) {
      console.log("createdBlogId", createdBlogId);
    }
  });
});

describe.only("Blog post update functionality", () => {
  test.only("updates the number of likes for a blog post", async () => {
    let newLikes = 15,
      blogId = "433bcb2d-cd3a-4bea-9e88-f4a2521eebb2";
    const response = await api
      .put(`/api/blogs/${blogId}`)
      .send({ likes: newLikes });

    assert.strictEqual(response.statusCode, 200, "Status code should be 200");

    assert.deepStrictEqual(
      response.body.likes,
      newLikes,
      "Likes should match updated value"
    );
  });
  test.only("returns 404 for non-existent blog post ID", async () => {
    let blogId = "invalid_id",
      newLikes = 15;
    const response = await api
      .put(`/api/blogs/${blogId}`)
      .send({ likes: newLikes });

    assert.strictEqual(response.statusCode, 404, "Status code should be 404");
  });
});

after(async () => {
  await mongoose.connection.close();
});
