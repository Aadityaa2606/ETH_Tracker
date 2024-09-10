const mongoose = require("mongoose");

// Define the schema for Deposit
const depositSchema = new mongoose.Schema({
  blockNumber: {
    type: Number,
    required: true,
  },
  blockTimestamp: {
    type: Date,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  hash: {
    type: String,
    required: true,
    unique: true, // Ensure that each deposit has a unique hash
  },
  pubkey: {
    type: String,
    required: true,
  },
});

// Create the model from the schema
const Deposit = mongoose.model("Deposit", depositSchema);

module.exports = Deposit;
