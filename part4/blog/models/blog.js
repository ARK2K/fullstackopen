const mongoose = require("mongoose");
const uuid = require("uuid");

mongoose.set("strictQuery", false);

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  _id: { type: String, required: true, default: () => uuid.v4() },
});

module.exports = mongoose.model("Blog", blogSchema);
