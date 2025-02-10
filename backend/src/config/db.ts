import mongoose, { Error } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB = process.env.MONGO_URI || "mongodb://localhost:27017/codenest";
const connectDb = async () => {
  try {
    const conn = await mongoose.connect(DB, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
export default connectDb;
