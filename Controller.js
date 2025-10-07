const mongoose = require("mongoose");
const IdeaModel = require("./Models/IdeasModel.js");
const UserModel = require("./Models/UserModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const SaveIdeaToDb = async (data) => {
  try {
    const Idea = new IdeaModel({
      Title: data.Title,
      Description: data.Description,
      SoftSavings: data.SoftSavings,
      HardSavings: data.HardSavings,
      UserId: data.UserId,
    });
    const saved = Idea.save();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

const register = async (data) => {
  const hashedPassword = await bcrypt.hash(data.Password, 10);
  try {
    const query = await UserModel.findOne({ UserName: data.UserName });
    console.log(query);
    if (query) {
      throw Error("User already exists");
    } else {
      const user = new UserModel({
        UserName: data.UserName,
        Password: hashedPassword,
      });
      user.save();
      return { ok: true };
    }
  } catch (err) {
    return {
      ok: false,
      error: err.message,
    };
  }
};

const login = async (data) => {
  try {
    const user = await UserModel.findOne({ UserName: data.UserName });
    if (!user) {
      throw Error("User does not exists");
    } else {
      const match = await bcrypt.compare(data.Password, user.Password);
      if (!match) {
        throw Error("Invalid credentials");
      } else {
        const token = jwt.sign(
          { id: user._id, role: user.Role, username: user.UserName },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        return { ok: true, token };
      }
    }
  } catch (err) {
    return { ok: false, error: err.message };
  }
};
module.exports = {
  SaveIdeaToDb,
  register,
  login,
};
