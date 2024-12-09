const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "college",
    },
    title: {
      type: String,
      require: true,
    },
    poster: {
      type: String,
      require: true,
    },
    youtubeLink: {
      type: String,
      require: true,
    },
    qrCode: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    place: {
      type: String,
      require: true,
    },
    entryFees: {
      type: String,
      require: true,
    },
    eDate: {
      type: String,
      require: true,
    },
    lastDate: {
      type: String,
      require: true,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("event", eventSchema);
