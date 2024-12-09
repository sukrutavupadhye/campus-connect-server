const mongoose = require("mongoose");
const collegeSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      require: true,
    },
    collegePlace: {
      type: String,
      require: true,
    },
    collegeWebsite: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    profile: {
      type: String,
      default: "college.jpg", // Replace with your default image URL
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("college", collegeSchema);
