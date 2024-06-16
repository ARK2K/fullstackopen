const express = require("express");
const { User } = require("../models/models");

const usersRouter = express.Router();

usersRouter.post("/", async (req, res) => {
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

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  res.json(users);
});

module.exports = usersRouter;
