const mongoose = require("mongoose");

// The schema for the deposit data
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
    unique: true, // Ensures that each deposit has a unique hash
  },
  pubkey: {
    type: String,
    required: true,
  },
});

const Deposit = mongoose.model("Deposit", depositSchema);

module.exports = Deposit;
