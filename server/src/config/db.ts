import mongoose from 'mongoose';

const DEFAULT_MONGO_URI =
  'mongodb+srv://testuser:edviron@edvironassessment.ub8p5.mongodb.net/?retryWrites=true&w=majority&appName=edvironAssessment';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB Atlas successfully!');
    return;
  } catch (err: any) {
    console.warn('⚠️ Could not connect to MongoDB Atlas URI:', err.message);
  }

  // Fallback to local memory server ONLY in local development environment
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('🔄 Local Development Fallback: Initializing MongoMemoryServer...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        binary: {
          version: '7.0.3', // Safe version for Debian 12+
        },
      });
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log('✅ Connected to MongoMemoryServer locally!');
      return;
    } catch (memErr: any) {
      console.error('⚠️ MongoMemoryServer fallback failed:', memErr.message);
    }
  }

  console.error('❌ Failed to establish database connection.');
};
