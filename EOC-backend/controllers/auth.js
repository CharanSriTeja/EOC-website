import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Sign Up
export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password, role, year } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      const error = new Error('Please provide all required fields');
      error.statusCode = 400;
      throw error;
    }

    if (role === 'student' && !year) {
      const error = new Error('Year is required for student accounts');
      error.statusCode = 400;
      throw error;
    }

    if (!['student', 'coordinator'].includes(role)) {
      const error = new Error('Invalid role');
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters long');
      error.statusCode = 400;
      throw error;
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare user data
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    if (role === 'student') {
      userData.year = year;
    }

    // Create user
    const newUsers = await User.create([userData], { session });

    // Generate token
    const token = jwt.sign(
      { userId: newUsers[0]._id, role: newUsers[0].role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: newUsers[0]._id,
        name: newUsers[0].name,
        email: newUsers[0].email,
        role: newUsers[0].role,
        year: newUsers[0].year,
        avatar: newUsers[0].avatar,
        createdAt: newUsers[0].createdAt,
      }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      const validationError = new Error(messages.join(', '));
      validationError.statusCode = 400;
      return next(validationError);
    }

    next(error);
  }
};

// Sign In
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      const error = new Error('Please provide email and password');
      error.statusCode = 400;
      throw error;
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        year: user.year,
        avatar: user.avatar,
      }
    });

  } catch (error) {
    next(error);
  }
};


export const signOut = async (req,res,next) => {
    
}
