import 'dotenv/config'; // Make sure env variables are loaded
import mongoose from 'mongoose';

// Get the MongoDB connection string from environment variables
const dbURI = process.env.DB_URI;

const connectDB = async () => {
  if (!dbURI) {
    console.error('Error: DB_URI is not defined in your .env file');
    process.exit(1); // Exit the process with a failure code
  }

  try {
    // Attempt to connect to the database
    await mongoose.connect(dbURI);
    console.log('MongoDB connected successfully.');
  } catch (err) {
    // Log the error if connection fails
    console.error('Error connecting to MongoDB:', err.message);
    // Exit the process with a failure code
    process.exit(1);
  }
};

export default connectDB;