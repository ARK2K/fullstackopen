const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

mongoose.set("strictQuery", false);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  _id: { type: String, required: true, default: () => uuid.v4() },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const saltRounds = 10;
  const hash = await bcrypt.hash(this.password, saltRounds);
  this.password = hash;
  next();
});

module.exports = mongoose.model("User", userSchema);
