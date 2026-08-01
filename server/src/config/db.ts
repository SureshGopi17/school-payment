import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;

  try {
    if (uri) {
      console.log('Attempting to connect to MongoDB Atlas...');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ Connected to MongoDB Atlas successfully!');
      return;
    }
  } catch (err: any) {
    console.warn('⚠️ Could not connect to MongoDB Atlas:', err.message);
    console.log('🔄 Fallback: Initializing MongoMemoryServer for instant local database execution...');
  }

  // Fallback to MongoMemoryServer
  try {
    const mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    console.log('✅ Connected to MongoMemoryServer locally!');
  } catch (memErr) {
    console.error('❌ Failed to start MongoMemoryServer:', memErr);
    process.exit(1);
  }
};
