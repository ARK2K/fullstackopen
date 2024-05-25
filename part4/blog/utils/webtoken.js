const jwt = require("jsonwebtoken");
const { User } = require("../models/models");

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("Authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
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
