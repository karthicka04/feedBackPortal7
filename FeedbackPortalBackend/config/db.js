import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const uri = 'mongodb+srv://root:karthi@cluster0.igilx.mongodb.net/Feedback?retryWrites=true&w=majority&appName=Cluster0';
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Log the first few characters of the URI to check format (without exposing credentials)
    console.log('MongoDB URI format check:', uri.substring(0, 20) + '...');
    
    // Validate URI format
    if (!uri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB URI format. Must start with mongodb+srv://');
    }

    // Check for required components
    const uriParts = uri.split('@');
    if (uriParts.length !== 2) {
      throw new Error('Invalid MongoDB URI format. Missing @ symbol or credentials');
    }

    const hostPart = uriParts[1];
    if (!hostPart.includes('.mongodb.net')) {
      throw new Error('Invalid MongoDB URI format. Missing .mongodb.net domain');
    }

    console.log('Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Connection URI format check failed');
    console.error('Please check your .env file and ensure MONGODB_URI follows this format:');
    console.error('mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority');
    process.exit(1);
  }
};

export default connectDB;
