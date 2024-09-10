// db.js - MongoDB connection setup
const mongoose = require("mongoose");

require("dotenv").config();

/**
 * This function connects to MongoDB using the MONGO_URI from the .env file.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error: ", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
