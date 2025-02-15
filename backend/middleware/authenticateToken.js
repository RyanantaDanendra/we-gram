const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log("decoded token", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(402).json({ message: "Invalid Token", error });
  }
};

module.exports = authenticateToken;
