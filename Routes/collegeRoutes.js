const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  Register,
  Login,
  getProfile,
  getEvents,
  createEvent,
  updateEvent,
  getSingleEvent,
  createCompetition,
  updateCompetition,
  getCompetitions,
  getSingleCompetition,
  getRegistrations,
  updateRegistration,
  postBlog,
  updateBlog,
  getBlogs,
  deleteBlog,
  getReport,
} = require("../Controllers/collegeController");
const { VerifyCollegeToken } = require("../Middleware/authCollege");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/college");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const eventStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/college/events");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const uploadEvent = multer({ storage: eventStorage });

const competitionsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/college/events/competitions");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const uploadCompetitions = multer({ storage: competitionsStorage });
const blogsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/college/blogs");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const uploadBlogs = multer({ storage: blogsStorage });

router.post("/Register", Register);
router.post("/Login", Login);
router.get("/getProfile", VerifyCollegeToken, getProfile);
//events
router.get("/getEvents", VerifyCollegeToken, getEvents);
router.get("/getSingleEvent/:id", VerifyCollegeToken, getSingleEvent);
router.post(
  "/createEvent",
  VerifyCollegeToken,
  uploadEvent.any("images"),
  createEvent
);
router.put(
  "/updateEvent/:id",
  VerifyCollegeToken,
  uploadEvent.any("images"),
  updateEvent
);
//blogs
router.get("/getBlogs", VerifyCollegeToken, getBlogs);
router.post(
  "/postBlog",
  VerifyCollegeToken,
  uploadBlogs.single("picture"),
  postBlog
);
router.put(
  "/updateBlog/:id",
  VerifyCollegeToken,
  uploadBlogs.single("picture"),
  updateBlog
);
//competitions
router.get("/getCompetitions/:eventId", VerifyCollegeToken, getCompetitions);
router.get(
  "/getSingleCompetition/:id",
  VerifyCollegeToken,
  getSingleCompetition
);
router.post(
  "/createCompetition",
  VerifyCollegeToken,
  uploadCompetitions.single("picture"),
  createCompetition
);
router.put(
  "/updateCompetition/:id",
  VerifyCollegeToken,
  uploadCompetitions.single("picture"),
  updateCompetition
);
router.delete("/deleteBlog/:id", VerifyCollegeToken, deleteBlog);
//registrations
router.get("/getRegistrations", VerifyCollegeToken, getRegistrations);
router.put("/updateRegistration/:id", VerifyCollegeToken, updateRegistration);
router.get("/getReport", VerifyCollegeToken, getReport);
module.exports = router;
