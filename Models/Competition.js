const mongoose = require("mongoose");
const competitionSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
    },
    title: {
      type: String,
      require: true,
    },
    picture: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    rules: {
      type: String,
      require: true,
    },
    isGrouped: {
      type: Boolean,
      require: true,
    },
    groupMembers: {
      type: String,
      require: true,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("competition", competitionSchema);
