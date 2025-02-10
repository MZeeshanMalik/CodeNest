import connectDb from "./config/db";
import { AppErrorTypes } from "./utils/types/AppErrorTypes";
import app from "./app";

const dotenv = require("dotenv");
// const app = express();
dotenv.config({ path: "./config.env" });

// connect to database
connectDb();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server has started....", port);
});
console.log("After app listen");
// handle unhandled promise rejection
process.on("unhandledRejection", (err: AppErrorTypes) => {
  console.error(`🚨 Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
// handle uncaught exception
process.on("uncaughtException", (err: AppErrorTypes) => {
  console.error(`🔥 Uncaught Exception: ${err.message}`);
  process.exit(1);
});
