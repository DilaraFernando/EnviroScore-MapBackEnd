import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      family: 4,
    } as mongoose.ConnectOptions);

    console.log('🌱 MongoDB Connected Successfully');
  } catch (error: any) {
    console.error('⚠️ MongoDB Connection Error:', error.message);
    console.log('🚀 Running Backend in Offline RAD Mode...');
  }
};

export default connectDB;