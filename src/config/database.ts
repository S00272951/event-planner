import { env } from '../config/env';
import mongoose from 'mongoose';

const uri = env.mongoURI;

export const connectDB = async (): Promise<void> => {
  try {
    // I don't print the uri because it has my password in it
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected (Mongoose): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
}

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};
