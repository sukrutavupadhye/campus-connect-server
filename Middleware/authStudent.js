const jwt = require("jsonwebtoken");
const secretKey = "collegeManagementSystem";

const VerifyStudentToken = async (req, res, next) => {
  let token = req.header("auth-token");
  if (!token) {
    return res.json({
      success: false,
      message: "Please authenticate using valid token",
    });
  }
  try {
    const studentId = jwt.verify(token, secretKey);
    req.student = studentId;
    next();
  } catch (err) {
    return res.json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { VerifyStudentToken };
