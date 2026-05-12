const jwt = require("jsonwebtoken");

// ======================
// VERIFY TOKEN
// ======================
exports.protect = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    // Check token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user data in request
    req.user = decoded;

    next();

  } catch (error) {
    console.error("❌ Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ======================
// ADMIN ONLY
// ======================
exports.adminOnly = (req, res, next) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    next();

  } catch (error) {
    console.error("❌ Admin Middleware Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

// ======================
// ROLE BASED ACCESS
// ======================
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed`,
      });
    }

    next();
  };
};