const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./utils/config");
const bcrypt = require("bcrypt");

const Blog = require("./models/blog");
const User = require("./models/user");

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

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).send("Blog post not found");
    }
    res.status(204).send(); // No content response for successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/blogs/:id", async (req, res) => {
  const { likes } = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, { likes: likes });

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

async function getAllUsers() {
  try {
    const users = await User.find({}, { username: 1, name: 1, _id: 1 }); // Projection object
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}

app.get("/api/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

async function createUser(username, password, name) {
  if (!username || !password || username.length < 3 || password.length < 3) {
    throw new Error("Username and password must be at least 3 characters long");
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    password: hashedPassword,
    name,
  });

  try {
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return error;
  }
}

app.post("/api/users", async (req, res) => {
  const { username, password, name } = req.body;

  try {
    const newUser = await createUser(username, password, name);
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = app;
