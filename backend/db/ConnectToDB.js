const mongoose = require("mongoose");

async function ConnectToDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = ConnectToDb;
