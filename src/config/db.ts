import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('🌱 MongoDB Connected Successfully');
  } catch (error) {
    // 💡 සර්වර් එක ක්‍රෑෂ් වෙන්න නොදී, Error එක විතරක් පෙන්වන්න සකස් කළා
    console.error('⚠️ MongoDB Connection Error:', error);
    console.log('🚀 Running Backend in Offline RAD Mode...');
    
    // process.exit(1); <-- සර්වර් එක වහලා දාන මේ ලයින් එක අක්‍රීය කළා (Comment කළා)
  }
};

export default connectDB;