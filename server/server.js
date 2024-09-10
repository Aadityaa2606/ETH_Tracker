require("dotenv").config();
const express = require("express");
const connectDB = require("./services/mongoService");
const { setupAlchemyWebSocket } = require("./services/alchemyService");
const Deposit = require("./models/Deposit");
const app = express();

connectDB();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/deposits", async (req, res) => {
  try {
    const deposits = await Deposit.find(); // Fetch all deposits
    res.status(200).json(deposits); // Return the deposits as JSON
  } catch (error) {
    res.status(500).json({ message: "Error fetching deposits", error });
  }
});

app.get("/deposits/hourly", async (req, res) => {
  try {
    // Extract date from query parameters, or use the current day if not provided
    let { date } = req.query;

    // If no date is provided, use the current date in "YYYY-MM-DD" format
    if (!date) {
      const currentDate = new Date();
      date = currentDate.toISOString().split("T")[0]; // Convert to "YYYY-MM-DD"
    }

    // Create start and end dates for the requested or current date
    const startOfDay = new Date(`${date}T00:00:00Z`); // Start of the day (00:00:00)
    const endOfDay = new Date(`${date}T23:59:59Z`); // End of the day (23:59:59)

    // Use MongoDB's aggregation to group by hour and count deposits
    const hourlyDeposits = await Deposit.aggregate([
      {
        $match: {
          blockTimestamp: {
            $gte: startOfDay, // Match documents from the start of the day
            $lte: endOfDay, // Until the end of the day
          },
        },
      },
      {
        $group: {
          _id: { $hour: "$blockTimestamp" }, // Group by hour
          no_of_deposits: { $sum: 1 }, // Count number of deposits in each hour
        },
      },
      {
        $sort: { _id: 1 }, // Sort by hour (ascending order)
      },
    ]);

    // Format the response to include the hour in a human-readable format
    const formattedDeposits = hourlyDeposits.map((deposit) => ({
      hour: deposit._id,
      no_of_deposits: deposit.no_of_deposits,
    }));

    res.status(200).json(formattedDeposits); // Send response
  } catch (error) {
    res.status(500).json({ message: "Error fetching hourly deposits", error });
  }
});


app.get("/deposit-counts", async (req, res) => {
  try {
    // Aggregate deposit counts grouped by `pubkey`
    const depositCounts = await Deposit.aggregate([
      {
        $group: {
          _id: "$pubkey", // Group by the `pubkey` field
          numberOfDeposits: { $sum: 1 }, // Count the number of deposits for each address
        },
      },
      {
        $sort: { numberOfDeposits: -1 }, // Sort by number of deposits in descending order
      },
    ]);

    // Transform the data for Grafana
    const transformedData = depositCounts.map((entry) => ({
      name: entry._id, // Address (pubkey) as the name
      value: entry.numberOfDeposits, // Number of deposits as the value
    }));

    res.status(200).json(transformedData); // Return the transformed data as JSON
  } catch (error) {
    res.status(500).json({ message: "Error fetching deposit counts", error });
  }
});

app.get("/deposits/histogram", async (req, res) => {
  try {
    const pipeline = [
      {
        $bucket: {
          groupBy: "$fee",
          boundaries: [
            0, 5000000000, 10000000000, 15000000000, 20000000000, 25000000000,
            30000000000, 35000000000, 40000000000,
          ],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ];

    const results = await Deposit.aggregate(pipeline);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching histogram data", error });
  }
});




// 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Initialize Alchemy WebSocket connection
  setupAlchemyWebSocket();
});
