const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/models");

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
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

module.exports = loginRouter;
