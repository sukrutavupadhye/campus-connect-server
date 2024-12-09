const mongoose = require("mongoose");
const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
    },
    competitionData: [
      {
        competition: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "competition",
        },
        participants: [],
      },
    ],
    amount: {
      type: String,
    },
    paymentStatus: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    bookingStatus: {
      type: String,
    },
    feedback: {
      type: String,
    },
    ratings: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("registration", registrationSchema);
