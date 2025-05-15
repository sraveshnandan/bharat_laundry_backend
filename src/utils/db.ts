import mongoose from "mongoose";
import { DB_URL_LOCAL } from "../config";

const connectDb = async () => {
  const { connection } = await mongoose.connect(DB_URL_LOCAL);
  return connection;
};

const connectToDatabase = async () => {
  try {
    const connection = await connectDb();
    return console.log(`Database connected: ${connection.host}`);
  } catch (error) {
    return console.log("Unable to connect to the server", error?.message);
  }
};

export { connectToDatabase };
