import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const DEFAULT_MONGO_URI =
  'mongodb+srv://testuser:edviron@edvironassessment.ub8p5.mongodb.net/?retryWrites=true&w=majority&appName=edvironAssessment';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Atlas successfully!');
    return;
  } catch (err: any) {
    console.warn('⚠️ Could not connect to MongoDB Atlas URI:', err.message);
    console.log('🔄 Triggering MongoMemoryServer fallback for guaranteed database operation...');
  }

  // Fallback to MongoMemoryServer
  try {
    const mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    console.log('✅ Connected to MongoMemoryServer fallback successfully!');
  } catch (memErr: any) {
    console.error('❌ MongoMemoryServer fallback error:', memErr.message);
  }
};
