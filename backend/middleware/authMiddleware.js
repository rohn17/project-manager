const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // id + role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};