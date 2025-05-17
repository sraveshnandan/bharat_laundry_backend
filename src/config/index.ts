import { configDotenv } from "dotenv";
configDotenv();

const PORT = process.env.PORT;
const DB_URL = process.env.MONGO_URI;
const DB_URL_LOCAL = process.env.MONGO_URI_LOCAL;
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const CLIENT_KEY_1 = process.env.CLIENT_KEY_1;
const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY;
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;
const SMS_GATEWAY_KEY = process.env.SMS_GATEWAY_KEY;

export {
  PORT,
  JWT_PRIVATE_KEY,
  DB_URL,
  DB_URL_LOCAL,
  CLIENT_KEY_1,
  JWT_ACCESS_KEY,
  JWT_REFRESH_KEY,
  SMS_GATEWAY_KEY,
};
