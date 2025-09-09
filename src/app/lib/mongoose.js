import mongoose from "mongoose";

let isConnected = false;

const connectionToDb = async () => {
  if (isConnected) return;

  const mongoUrl = process.env.MongoURL;
  if (!mongoUrl) {
    throw new Error("MongoURL environment variable is not set");
  }

  try {
    await mongoose.connect(mongoUrl);
    isConnected = true;
    console.log("Connected to Database");
  } catch (error) {
    console.error("Failed to connect to Database:", error);
    throw error;
  }
};

export default connectionToDb;
