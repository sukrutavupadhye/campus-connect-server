const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  Register,
  Login,
  getProfile,
  getAllColleges,
  updateCollegeStatus,
  getAllStudents,
  updateStudentStatus,
  getReport,
} = require("../Controllers/adminController");
const { VerifyAdminToken } = require("../Middleware/authAdmin");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/admin");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/Register", Register);
router.post("/Login", Login);
router.get("/getProfile", VerifyAdminToken, getProfile);

router.get("/getAllColleges", VerifyAdminToken, getAllColleges);
router.put("/updateCollegeStatus/:id", VerifyAdminToken, updateCollegeStatus);
router.get("/getAllStudents", VerifyAdminToken, getAllStudents);
router.put("/updateStudentStatus/:id", VerifyAdminToken, updateStudentStatus);
router.get("/getReport", VerifyAdminToken, getReport);
module.exports = router;
