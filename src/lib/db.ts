import mongoose from "mongoose";

const globalWithMongoose = global as typeof globalThis & {
  mongoose: { connection: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

const cached = globalWithMongoose.mongoose ?? { connection: null, promise: null };
globalWithMongoose.mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is missing. Add it to .env.local or .env");
  }

  if (cached.connection) return cached.connection;

  cached.promise ??= mongoose.connect(mongodbUri, { serverSelectionTimeoutMS: 10_000 });

  try {
    cached.connection = await cached.promise;
    console.log("MongoDB connected");
    return cached.connection;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
