const { test, after, describe } = require("node:test");
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
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.delete(`/api/blogs/${nonExistentId}`).expect(404);
  });

  test("deletes a blog post and returns 204", async () => {
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

    const createdBlogId = response.body.id;

    await api.delete(`/api/blogs/${createdBlogId}`).expect(204);
  });
});

describe("Blog post update functionality", () => {
  test("updates the number of likes for a blog post", async () => {
    const newBlog = {
      title: "Test Blog Post Like Update",
      author: "Jest Tester",
      url: "https://jestjs.io/",
      likes: 5,
    };

    // Create a new blog post
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const createdBlogId = response.body.id;

    // Update the blog post likes
    const newLikes = 15;
    await api
      .put(`/api/blogs/${createdBlogId}`)
      .send({ likes: newLikes })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const res = await api
      .put(`/api/blogs/${createdBlogId}`)
      .send()
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(res.body.likes, newLikes);
  });

  test("returns 404 for non-existent blog post ID", async () => {
    const blogId = new mongoose.Types.ObjectId();
    const newLikes = 15;

    await api.put(`/api/blogs/${blogId}`).send({ likes: newLikes }).expect(404);
  });
});

after(async () => {
  await mongoose.connection.close();
});
