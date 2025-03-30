const { Client, LocalAuth } = require("whatsapp-web.js");
const { getUsers, handleMessage } = require("../routes/initialize");

// Store connection timestamps for each bot
const connectionTimestamps = {};

// Initialize a WhatsApp client for a user
async function initializeWhatsAppClient(userId) {
  try {
    // Check if bot is already initialized
    const users = getUsers();
    if (users[userId]) {
      console.log(`Bot for ${userId} is already initialized`);
      return { success: true, message: "Bot is already running" };
    }
    
    // Initialize new WhatsApp client
    const client = new Client({
      authStrategy: new LocalAuth({ clientId: userId }),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });
    
    // Store client in users object
    users[userId] = client;
    
    // Set up event handlers
    client.on("ready", () => {
      console.log(`WhatsApp client ready for ${userId}`);
      // Record connection timestamp when bot is ready
      connectionTimestamps[userId] = Date.now();
    });
    
    client.on("message", async (message) => {
      // Only process messages that arrive after the bot started
      if (message.timestamp * 1000 >= (connectionTimestamps[userId] || 0)) {
        await handleMessage(message, userId);
      } else {
        console.log(`Ignoring older message for ${userId} from ${message.from}`);
      }
    });
    
    client.on("disconnected", async () => {
      console.log(`WhatsApp client disconnected for ${userId}`);
      delete users[userId];
      delete connectionTimestamps[userId];
    });
    
    // Initialize client
    await client.initialize();
    console.log(`Successfully initialized bot for ${userId}`);
    
    return { success: true, message: "Bot initialized successfully" };
  } catch (error) {
    console.error(`Error initializing WhatsApp client for ${userId}:`, error);
    return { success: false, error: error.message };
  }
}

module.exports = { 
  initializeWhatsAppClient,
  // Export for testing purposes
  getConnectionTimestamps: () => connectionTimestamps
};