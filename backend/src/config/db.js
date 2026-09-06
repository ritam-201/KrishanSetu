import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisansetu';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to external MongoDB server: ${error.message}`);
    console.warn(`[MongoDB Warning] Server will run in fallback demo mode.`);
    return false;
  }
};
