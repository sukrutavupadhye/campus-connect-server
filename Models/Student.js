const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "college",
    },
    course: {
      type: String,
      require: true,
    },
    classYear: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    profile: {
      type: String,
      default: "student.jpg", // Replace with your default image URL
    },
    blockedBy: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("student", studentSchema);
