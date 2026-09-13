import mongoose from "mongoose";

const mongodbUri = process.env.MONGODB_URI!;

if (!mongodbUri) {
  throw new Error("MONGODB_URI is missing");
}

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(mongodbUri);
  console.log("MongoDB connected");
};
// can add cached and all things but as project has no more data so its ok for this.