const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./utils/config");
const { Blog, User } = require("./models/models");
const jwt = require("jsonwebtoken");
const { tokenExtractor, userExtractor } = require("./utils/webtoken");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) =>
    logger.error("error connecting to MongoDB:", error.message)
  );

app.use(cors());
app.use(express.json());

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 });
  res.json(blogs);
});

const validateBlog = (req, res, next) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: "Missing required property" });
  }
  next();
};

const createBlog = async (title, author, url, likes) => {
  const firstUser = await User.findOne(); // Find the first user
  if (!firstUser) {
    throw new Error("No users found to assign as creator");
  }

  const newBlog = new Blog({
    title,
    url,
    author,
    likes,
    user: firstUser._id, // Assign the first user's ID as creator
  });

  const savedBlog = await newBlog.save();
  if (!firstUser.blogs) {
    firstUser.blogs = [];
  }
  firstUser.blogs = firstUser.blogs.concat(newBlog._id);
  await firstUser.save();

  return savedBlog;
};

app.post(
  "/api/blogs",
  validateBlog,
  tokenExtractor,
  userExtractor,
  async (req, res, next) => {
    try {
      const { title, url, author, likes } = req.body;
      const newBlog = await createBlog(title, author, url, likes);
      res.status(201).json(newBlog);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }
);

app.delete(
  "/api/blogs/:id",
  tokenExtractor,
  userExtractor,
  async (req, res) => {
    const id = req.params.id;
    console.log(`Deleting blog with ID: ${id}`);
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }

    const user = req.user;
    if (blog.user.toString() !== user._id.toString()) {
      return res.status(401).json({ error: "unauthorized" });
    }

    await Blog.findByIdAndDelete(id);
    res.status(204).end();
  }
);

app.put("/api/blogs/:id", async (req, res) => {
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

    return res.status(200).json(blog);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create a new user
app.post("/api/users", async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !password || username.length < 3 || password.length < 3) {
    return res.status(400).json({
      error: "Username and password must be at least 3 characters long.",
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "Username must be unique." });
  }

  const passwordHash = await User.hashPassword(password);

  const newUser = new User({
    username,
    name,
    passwordHash,
    blogs: [],
  });

  const savedUser = await newUser.save();

  res.status(201).json(savedUser);
});

app.get("/api/users", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  res.json(users);
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  const passwordValid = await user.validatePassword(password);
  if (!passwordValid) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  res.status(200).json({ token, username: user.username, name: user.name });
});

module.exports = app;
