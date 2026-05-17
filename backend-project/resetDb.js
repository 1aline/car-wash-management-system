require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

async function reset() {
  try {
    await connectDB();
    console.log("Dropping database to clear old unique indexes...");
    await mongoose.connection.dropDatabase();
    console.log("Database dropped successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error dropping database:", error);
    process.exit(1);
  }
}

reset();
