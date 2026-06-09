import mongoose from "mongoose";

let gridFSBucket: mongoose.mongo.GridFSBucket | null = null;

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    if (db) {
      gridFSBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "pdfs" });
    }
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

export function getGridFSBucket(): mongoose.mongo.GridFSBucket {
  if (!gridFSBucket) {
    throw new Error("GridFS bucket not initialized. Call connectDB() first.");
  }
  return gridFSBucket;
}
