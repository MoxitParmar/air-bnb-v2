import mongoose from "mongoose";
import { DB_NAME } from "../constance.js";

// Function to connect to the MongoDB database hello-express
const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the MONGODB_URL environment variable and the DB_NAME constant
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    // Log a success message with the host of the connected MongoDB instance
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    // Log an error message if the MongoDB connection fails and exit the process
    console.log("mongoDB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
