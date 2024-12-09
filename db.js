const mongoose = require("mongoose");
const mongoUri = "mongodb://localhost:27017/college-event-management";
// const mongoUri = "mongodb://127.0.0.1:27017/college-event-management";";

const connectMongoDb = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectMongoDb;
