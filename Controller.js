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
          { id: user._id, role: user.Role, UserName: user.UserName },
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

const getIdeas = async (user) => {
  try {
    const ideas = await IdeaModel.find({
      UserId: user.UserName,
    });
    console.log(ideas);
    return { ok: true, ideas };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

const getIdeasAll = async () => {
  try {
    const ideas = await IdeaModel.find();
    console.log(ideas);
    return { ok: true, ideas };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

const AdminDashboardStats = async (user) => {
  try {
    const result = await IdeaModel.find();
    let TotalSavings = 0;
    let TotalHardSavings = 0;
    let TotalSoftSavings = 0;
    console.log(result);
    let map = {
      Draft: 0,
      "in-Approval": 0,
      Qualification: 0,
      Development: 0,
      Deployed: 0,
    };
    result.forEach((idea) => {
      map[idea.Status]++;
      TotalSavings += idea.HardSavings + idea.SoftSavings;
      TotalHardSavings += idea.HardSavings;
      TotalSoftSavings += idea.SoftSavings;
    });
    console.log(map);
    const SavingsData = {
      TotalHardSavings: ((TotalHardSavings * 100) / TotalSavings).toFixed(2),
      TotalSoftSavings: ((TotalSoftSavings * 100) / TotalSavings).toFixed(2),
      TotalSavings,
    };
    return { ok: true, StatusData: map, SavingsData };
  } catch (err) {
    console.log(err);
    return { ok: false, error: err.message };
  }
};
const UpdateUrl = async (objid, url) => {
  const response = await IdeaModel.findByIdAndUpdate(
    { _id: objid },
    { URL: url },
    { new: false }
  );
  return response;
};

module.exports = {
  SaveIdeaToDb,
  register,
  login,
  getIdeas,
  getIdeasAll,
  AdminDashboardStats,
  UpdateUrl,
};
