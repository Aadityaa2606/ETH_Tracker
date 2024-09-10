require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const connectDB = require("./services/mongoService");
const { setupAlchemyWebSocket } = require("./services/alchemyService");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Initialize Alchemy WebSocket connection
  setupAlchemyWebSocket();
});
