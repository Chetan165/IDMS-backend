const { Type } = require("@aws-sdk/client-s3");
const mongoose = require("mongoose");
const IdeadSchema = mongoose.Schema({
  Title: {
    type: String,
    required: true,
    trim: true,
  },
  Description: {
    type: String,
    required: true,
    trim: true,
  },
  SoftSavings: {
    type: Number,
    required: true,
  },
  HardSavings: {
    type: Number,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  Status: {
    type: String,
    enum: ["Draft", "in Approval", "Qualification", "Development", "Deployed"],
    default: "Draft",
  },
  UserId: {
    type: String,
    required: true,
  },
  URL: {
    type: String,
    default: "",
  },
});

const Ideas = mongoose.model("Idea", IdeadSchema);
module.exports = Ideas;
