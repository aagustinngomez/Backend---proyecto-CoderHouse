import { connect } from "mongoose";
import config from "../config/config.js";
import { getLogger } from "../utils/logger.js";

const { DB_CNN, DB_NAME } = config;

const configConnection = {
  url: DB_CNN,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: DB_NAME,
  },
};

export const mongoDBConnection = async () => {
  const logger = getLogger();
  try {
    await connect(configConnection.url, configConnection.options);
    logger.info(`Connected to MongoDB at ${configConnection.url.substring(0, 20)}...`);
  } catch (err) {
    logger.fatal("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the process if the connection fails
  }
};