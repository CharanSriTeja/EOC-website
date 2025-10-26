import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js'; // adjust path as needed
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.DB_URI);

    const existingAdmin = await User.findOne({ email: 'newadmin91@eoc.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
    } else {
      const hashedPassword = await bcrypt.hash('newadmin91', 10);
      const admin = new User({
        name: 'Admin User',
        email: 'newadmin91@eoc.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      await admin.save();
      console.log('Admin user created');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin();
