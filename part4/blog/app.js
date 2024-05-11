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

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);
  console.log(request);
  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = app;
