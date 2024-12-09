const mongoose = require("mongoose");
const listSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "competition",
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("list", listSchema);
