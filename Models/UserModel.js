const mongoose = require("mongoose");

const UserModel = mongoose.Schema({
  UserName: {
    type: String,
    required: true,
    trim: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
});

const User = mongoose.model("User", UserModel);
module.exports = User;
