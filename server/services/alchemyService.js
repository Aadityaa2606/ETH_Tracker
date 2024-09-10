require("dotenv").config(); // Load environment variables from .env file
const { Alchemy, Network, AlchemySubscription } = require("alchemy-sdk");
const Deposit = require("../models/Deposit"); // Make sure the path is correct
const Web3 = require("web3");
const sendTelegramNotification = require("./telegramService");

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// Retrieve API key from environment variables
if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY is not defined in the .env file");
}

const settings = {
  apiKey: ALCHEMY_API_KEY, // Use your Alchemy API Key
  network: Network.ETH_SEPOLIA, // Use your network
};

const alchemy = new Alchemy(settings);

const setupAlchemyWebSocket = () => {
  // Subscribe to transactions for the Beacon Deposit Contract
  alchemy.ws.on(
    {
      method: AlchemySubscription.MINED_TRANSACTIONS,
      addresses: ["0x00000000219ab540356cBB839Cbe05303d7705Fa"],
      includeRemoved: false,
      hashesOnly: false,
    },
    (tx) => {
      console.log("Received transaction:", tx);
      // Process and save the deposit data to MongoDB
      saveDeposit(tx);
    }
  );

  console.log("Alchemy WebSocket subscription set up");
};

/**
 * Function to fetch deposit history from Alchemy
 */
// const getDepositHistory = async () => {
//   try {
//     // Get the latest block number
//     const latestBlock = await alchemy.core.getBlockNumber();

//     // Fetch asset transfers from the latest block to the Beacon Deposit Contract
//     const data = await alchemy.core.getAssetTransfers({
//       fromBlock: `0x${(latestBlock - 1).toString(16)}`, // One block before the latest block
//       toBlock: `0x${(latestBlock - 1).toString(16)}`, // Ensure it fetches only from the latest block
//       toAddress: "0x00000000219ab540356cBB839Cbe05303d7705Fa", // Beacon Deposit Contract address
//       category: ["external"], // Only external transfers
//       order: "desc", // Order by latest first
//     });

//     // console.log("Deposit history from latest block:", data["transfers"]);
//     console.log("Total deposits:", data["transfers"].length);
//     console.log("Latest block:", latestBlock);  

//     // Process each transfer
//     for (const transfer of data.transfers) {
//       // Process and save the deposit data to MongoDB
//       // saveDeposit(transfer);
//     //   console.log("Deposit processed:", transfer);
//     }
//   } catch (error) {
//     console.error("Error fetching deposit history:", error);
//   }
// };


// Function to save deposit data to MongoDB
async function saveDeposit(receivedTransaction) {
  try {
    // Clear the collection
    await Deposit.deleteMany({});

    // Extract relevant fields and convert where necessary
    const { transaction } = receivedTransaction;
    const depositData = {
      blockNumber: parseInt(transaction.blockNumber, 16), // Convert hex to decimal
      blockTimestamp: new Date(), // Assuming current timestamp, adjust if you have this info
      fee: parseInt(transaction.gasPrice, 16), // Convert hex to decimal
      hash: transaction.hash, // Transaction hash
      pubkey: transaction.from, // Assuming "from" is the pubkey
    };

    // Create a new deposit instance
    const deposit = new Deposit(depositData);

    await deposit.save();
    console.log("Transaction saved successfully:", deposit);

    // Send Telegram notification
    const message = `New transaction saved:\nHash: ${depositData.hash}\nBlock Number: ${depositData.blockNumber}\nFee: ${depositData.fee}`;
    await sendTelegramNotification(message);
    console.log("Transaction saved successfully:", deposit);
  } catch (error) {
    console.error("Error saving transaction:", error);
  }
}
// Export functions
module.exports = {
  setupAlchemyWebSocket,
  getDepositHistory,
};


// Received transaction: {
//   removed: false,
//   transaction: {
//     blockHash: '0xa20a52662c3fc3623026c748c68d935c2d85a445ad717b095dc3a76ea0fbfa1f',
//     blockNumber: '0x65b53a',
//     from: '0x66f66b33e8f10fc6013e20017cebb2fac2270b17',
//     gas: '0x3ad2e',
//     gasPrice: '0x1dc82a0a7',
//     maxFeePerGas: '0x219ea99f7',
//     maxPriorityFeePerGas: '0x34201e',
//     hash: '0x502f1e976b4c8bc92b1a2c08b3f41e239381bb0488234d427817acc4e1521230',
//     input: '0xe11013dd00000000000000000000000066f66b33e8f10fc6013e20017cebb2fac2270b170000000000000000000000000000000000000000000000000000000000030d4000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000005312e302e30000000000000000000000000000000000000000000000000000000',
//     nonce: '0xb',
//     to: '0x5f5a404a5edabcdd80db05e8e54a78c9ebf000c2',
//     transactionIndex: '0xc5',
//     value: '0x71afd498d0000',
//     type: '0x2',
//     accessList: [],
//     chainId: '0xaa36a7',
//     v: '0x1',
//     r: '0xc4676e91bbb3c7d11c0c7ec014e80e453666893f2a2bcd10033cec5d5a63efcf',
//     s: '0x7a514592d29ef8a25e073469d8737e6bb4299a380acc64a8e01766b528ed3726',
//     yParity: '0x1'
//   }
// }