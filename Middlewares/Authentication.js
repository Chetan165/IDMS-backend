const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ ok: false, msg: "No token, authorization denied" });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.json({ ok: false, msg: "Token is not valid" });
    }
  }
};

module.exports = auth;
