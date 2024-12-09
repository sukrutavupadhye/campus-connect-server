const jwt = require("jsonwebtoken");
const secretKey = "collegeManagementSystem";

const VerifyCollegeToken = async (req, res, next) => {
  let token = req.header("auth-token");
  if (!token) {
    return res.json({
      success: false,
      message: "Please authenticate using valid token",
    });
  }
  try {
    const collegeId = jwt.verify(token, secretKey);
    req.college = collegeId;
    next();
  } catch (err) {
    return res.json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { VerifyCollegeToken };
