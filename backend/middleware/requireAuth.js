const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const requireAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ message: "authorization Token Required" });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    req.user = await User.findById({ _id }).select("_id");
    if (!req.user) {
      res.status(401).json({ error: "User not found" });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
