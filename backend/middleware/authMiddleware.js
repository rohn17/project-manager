const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json("No token, access denied");
  }

  try {
    // Remove "Bearer "
    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // contains id & role
    next();
  } catch (err) {
    res.status(401).json("Invalid token");
  }
};