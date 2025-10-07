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
  Username: {
    type: String,
    required: true,
  },
});

const Ideas = mongoose.model("Idea", IdeadSchema);
module.exports = Ideas;
