const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const DB_URI = process.env.DB_URI;
if (!DB_URI) {
  throw Error("Mongodb ur is not provided");
}

const ConnectDb = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("connected to db");
  } catch (err) {
    console.log(err);
  }
};

module.exports = ConnectDb;
