# Ethereum Deposit Tracker 
        - By Aaditya Nagarajan

## Description

The **Ethereum Deposit Tracker** is a robust and efficient tool designed to monitor and record ETH deposits on the Beacon Deposit Contract. It provides real-time tracking of incoming deposits, sends notifications for new transactions, and offers detailed visualizations through a Grafana dashboard.

## Features

- **Tracks All Incoming Deposits**: Monitors deposits made to the Beacon Deposit Contract address.
- **Real-Time Connection**: Maintains a real-time connection with the Ethereum node using RPC.
- **Telegram Notifications**: Sends notifications via a Telegram bot with details of each new transaction.
- **Grafana Dashboard**: Provides comprehensive data visualization, including:
  - **Deposit Transaction Overview**: A table containing all transactions.
    ![alt text](image.png)
  - **Top Depositors (Pie Chart)**: Identifies addresses responsible for the largest deposits and shows how deposits are distributed among different users.
  ![alt text](image-1.png)
  - **Deposit Size Distribution (Histogram)**: Visualizes how deposit amounts are distributed and identifies common deposit sizes.
  ![alt text](image-2.png)
  - **Number of Deposits Per Time Period (Bar Chart)**: Displays spikes in deposit activity and frequency of deposits over time.
  ![alt text](image-3.png)
  - **Average Transaction Fee Per Time Period (Bar Chart)**: Compares average transaction fees over different time intervals and shows how network congestion affects fees.
  ![alt text](image-4.png)


## Installation

### Install Node.js

1. **Windows**:
   - Download the installer from [Node.js official website](https://nodejs.org/).
   - Run the installer and follow the prompts.

2. **macOS**:
   - Install using Homebrew:
     ```bash
     brew install node
     ```

3. **Ubuntu**:
   - Update package index:
     ```bash
     sudo apt update
     ```
   - Install Node.js:
     ```bash
     sudo apt install nodejs npm
     ```

### Install Grafana

1. **Windows**:
   - Download the installer from [Grafana official website](https://grafana.com/grafana/download).
   - Run the installer and follow the prompts.

2. **macOS**:
   - Install using Homebrew:
     ```bash
     brew install grafana
     ```

3. **Ubuntu**:
   - Install Grafana:
     ```bash
     sudo apt-get install -y software-properties-common
     sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
     sudo apt-get update
     sudo apt-get install grafana
     ```
   - Start Grafana service:
     ```bash
     sudo systemctl start grafana-server
     sudo systemctl enable grafana-server
     ```

### Create a Telegram Bot

1. Open the [Telegram app](https://telegram.org/).
2. Search for the “BotFather” bot.
3. Start a chat with BotFather and use the `/newbot` command to create a new bot.
4. Follow the instructions to get your **Telegram Bot Token**.
5. Note your **Chat ID** by messaging the bot and using the Telegram API to fetch your chat ID (you can find guides online on how to do this).

### Clone the Repository

1. Clone the repository:
   ```bash
   git clone https://github.com/Aadityaa2606/ETH_Tracker.git
    ```

2. Navigate to the server directory:
    ```bash
    cd ETH_Tracker/server
    ```

3. Install the required dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the `server` directory and add the following environment variables:

    ```bash
    MONGO_URI=mongodb+srv://admin:admin@cluster0.marg2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    ALCHEMY_API_KEY=your-alchemy-api
    PORT=5000
    TELEGRAM_BOT_TOKEN=your-telegram-bot-token
    CHAT_ID=your-chat-id
    TARGET_ADDRESS=0x00000000219ab540356cBB839Cbe05303d7705Fa
    ```

    - MONGO_URI: This is hardcoded to preserve the deposits

    - ALCHEMY_API_KEY: You can get it by signing up at Alchemy.

    - PORT: Port on which your server will run.

    - TELEGRAM_BOT_TOKEN: Replace your-telegram-bot-token with the token you received from BotFather.

    - CHAT_ID: Your Telegram chat ID where notifications will be sent. Replace your-chat-id with your actual chat ID get it by doing the following.
        - start chatting with your bot.
        - send a message to your bot.
        - go to the following URL: https://api.telegram.org/bot<YourBOTToken>/getUpdates
        - look for the chat ID in the response.

    - TARGET_ADDRESS: The Ethereum Beacon Deposit Contract address (hardcoded).

5. Start the server:
    ```bash
    npm start
    ```
6. Start Grafana:
    
    - Open your browser and go to http://localhost:3000 to access the Grafana interface.
    - Log in using the default credentials (username: admin, password: admin).
    - In Grafana, create a new dashboard.
    - Choose the option to import from JSON.
    - Upload the JSON present in the root directory of the repository.

### Usage
 - The application will begin tracking deposits and sending notifications via Telegram.

 - You can view the Grafana dashboard at http://localhost:3000.

 - The server will be accessible at http://localhost:5000.

## API Endpoints for Grafana

### 1. **GET /deposits**

Returns all values of the deposit schema:

```json
[
  {
    "_id": "66e04409a78ae29273951365",
    "blockNumber": 6666742,
    "blockTimestamp": "2024-09-10T13:05:13.415Z",
    "fee": 23210853484,
    "hash": "0x29c919c5f5a2d4313c68f763139be82adebadec41651de34b238f507cfb8bf80",
    "pubkey": "0x1bc389622f209bfb29e32b5aff20df71c06ceb6e",
    "__v": 0
  },
  ...
]
```

### 2. **GET /deposits/hourly**

Returns the number of deposits grouped by the hour of the day:

```json
[
  {
    "_id": "66e04409a78ae29273951365",
    "blockNumber": 6666742,
    "blockTimestamp": "2024-09-10T13:05:13.415Z",
    "fee": 23210853484,
    "hash": "0x29c919c5f5a2d4313c68f763139be82adebadec41651de34b238f507cfb8bf80",
    "pubkey": "0x1bc389622f209bfb29e32b5aff20df71c06ceb6e",
    "__v": 0
  },
  ...
]
```

### 3. **GET /deposit-counts**

Returns the number of deposits grouped by the hour of the day:

```json
[
  {
    "_id": "66e04409a78ae29273951365",
    "count": 5
  },
  ...
]
```

### 4. **GET /deposits/histogram**

Returns the histogram data for the number of deposits in specific fee ranges:

```json
[
  {
    "_id": 10000000000,
    "count": 4
  },
  {
    "_id": 15000000000,
    "count": 4
  },
  ...
]
```

