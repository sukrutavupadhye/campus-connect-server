const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  Register,
  Login,
  getProfile,
  viewEvents,
  viewColleges,
  viewSingleEventDetails,
  viewSingleCompetitionDetails,
  removeFromList,
  addIntoList,
  getStudentList,
  registerForEvent,
  getStudentRegistrations,
  updateRegistration,
  singleBlog,
  viewAllBlogs,
} = require("../Controllers/studentController");
const { VerifyStudentToken } = require("../Middleware/authStudent");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/student");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/Register", Register);
router.post("/Login", Login);
router.get("/getProfile", VerifyStudentToken, getProfile);
router.get("/viewColleges", viewColleges);
router.get("/viewEvents", viewEvents);
router.get("/viewAllBlogs", viewAllBlogs);
router.get("/singleBlog/:id", VerifyStudentToken, singleBlog);
router.get(
  "/viewSingleEventDetails/:id",
  VerifyStudentToken,
  viewSingleEventDetails
);
router.get(
  "/viewSingleCompetitionDetails/:id",
  VerifyStudentToken,
  viewSingleCompetitionDetails
);
router.post("/addIntoList/:id", VerifyStudentToken, addIntoList);
router.delete("/removeFromList/:id", VerifyStudentToken, removeFromList);
router.get("/getStudentList", VerifyStudentToken, getStudentList);
router.post("/registerForEvent", VerifyStudentToken, registerForEvent);
router.get(
  "/getStudentRegistrations",
  VerifyStudentToken,
  getStudentRegistrations
);
router.put("/updateRegistration/:id", VerifyStudentToken, updateRegistration);
module.exports = router;
