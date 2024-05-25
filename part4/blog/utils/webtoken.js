const jwt = require("jsonwebtoken");
const { User } = require("../models/models");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (decodedToken.id) {
      req.user = await User.findById(decodedToken.id);
    }
  }
  next();
};

module.exports = {
  tokenExtractor,
  userExtractor,
};
