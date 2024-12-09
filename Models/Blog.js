const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "college",
    },
    title: {
      type: String,
      require: true,
    },
    picture: {
      type: String,
      require: true,
    },
    firstDescription: {
      type: String,
      require: true,
    },
    secondDescription: {
      type: String,
      require: true,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("blog", blogSchema);
