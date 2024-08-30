import mongoose from "mongoose";

// Global variable to store the cached connection
let cachedConnection: typeof mongoose | null = null;

const connect = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }

  try {
    const opts = {
      bufferCommands: false,
    };

    const connection = await mongoose.connect(process.env.MONGO_URI, opts);
    cachedConnection = connection;
    console.log("MongoDB connection successfully established.");
    return connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

const disconnect = async () => {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    console.log("MongoDB connection closed.");
  }
};

export { connect, disconnect };
