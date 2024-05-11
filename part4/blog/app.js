const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./utils/config");

const Blog = require("./models/blog");

const mongoUrl = config.MONGODB_URI;
mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());

app.get("/api/blogs", async (request, response) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    console.error(error);
    response.status(500).send("Error retrieving blogs");
  }
});

const validateBlog = (req, res, next) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: "Missing required property" });
  }
  next();
};

app.post("/api/blogs", validateBlog, async (request, response) => {
  try {
    const blog = new Blog(request.body);
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
