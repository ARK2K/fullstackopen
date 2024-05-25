const express = require("express");
const { Blog, User } = require("../models/models");
const jwt = require("jsonwebtoken");
const { userExtractor } = require("../utils/webtoken");

const blogsRouter = express.Router();

const validateBlog = (req, res, next) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: "Missing required property" });
  }
  next();
};

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 });
  res.json(blogs);
});

blogsRouter.post("/", validateBlog, userExtractor, async (req, res, next) => {
  const { title, url, author, likes } = req.body;
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: "token missing or invalid" });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const newBlog = new Blog({
      title,
      url,
      author,
      likes,
      user: user._id,
    });

    const savedBlog = await newBlog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", userExtractor, async (req, res, next) => {
  const id = req.params.id;
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: "token missing or invalid" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const user = req.user;
    if (blog.user.toString() !== user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await Blog.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (req, res, next) => {
  const { likes } = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
