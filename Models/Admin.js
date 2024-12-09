const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
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
      default: "admin.jpg", // Replace with your default image URL
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("admin", adminSchema);
