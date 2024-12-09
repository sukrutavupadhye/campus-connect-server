const jwt = require("jsonwebtoken");
const secretKey = "collegeManagementSystem";

const VerifyAdminToken = async (req, res, next) => {
  let token = req.header("auth-token");
  if (!token) {
    return res.json({
      success: false,
      message: "Please authenticate using valid token",
    });
  }
  try {
    const adminId = jwt.verify(token, secretKey);
    req.admin = adminId;
    next();
  } catch (err) {
    return res.json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { VerifyAdminToken };
