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
  const authorization = req.get("Authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
    try {
      const decodedToken = jwt.verify(req.token, process.env.SECRET);
      console.log("Decoded token:", decodedToken);
      if (decodedToken.id) {
        req.user = await User.findById(decodedToken.id);
      } else {
        req.user = null;
      }
    } catch (error) {
      console.error("Failed to verify token:", error);
      req.user = null;
    }
  } else {
    req.token = null;
    req.user = null;
  }
  next();
};

module.exports = {
  tokenExtractor,
  userExtractor,
};
