import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/emailService.js';
import { sendResetPasswordEmail } from '../utils/emailService.js';

// Sign Up
export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password, role, year } = req.body;
    console.log("[signUp] Received signup request:", req.body);

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

    const existingUser = await User.findOne({ email });
    console.log("[signUp] Existing user check:", existingUser);
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("[signUp] Hashed password created");

    const userData = { name, email, password: hashedPassword, role, isVerified: false };
    if (role === 'student') userData.year = year;

    const newUsers = await User.create([userData], { session });
    console.log("[signUp] User created:", newUsers);

    const verifyToken = jwt.sign(
      { userId: newUsers[0]._id },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );
    console.log("[signUp] Verification token generated");

    const verificationUrl = `${process.env.FRONTEND_URL}/#/verify-email/${verifyToken}`;
    await sendVerificationEmail(email, verificationUrl);
    console.log("[signUp] Verification email sent");

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created! Please verify your email before logging in.',
    });

  } catch (error) {
    console.error("[signUp] Error:", error);
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};



// controllers/auth.controller.js
export const signIn = async (req, res, next) => {
  try {
    console.log("[signIn] Received signin request:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Please provide email and password');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email }).select('+password');
    console.log("[signIn] Found user:", user);

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Add verification check here
    if (!user.isVerified) {
      const error = new Error('Email not verified. Please verify your email before logging in.');
      error.statusCode = 403; // Forbidden
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );
    console.log("[signIn] Token generated");

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
    console.error("[signIn] Error:", error);
    next(error);
  }
};



export const signOut = async (req,res,next) => {
    
}

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).send('User not found');
    if (user.isVerified) return res.status(400).send('Already verified');

    user.isVerified = true;
    await user.save();

    res.send('Email verified. You may now login.');
  } catch (err) {
    res.status(400).send('Invalid or expired verification link');
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'User already verified' });
    }

    // Generate a new verification token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });

    const verificationUrl = `${process.env.FRONTEND_URL}/#/verify-email/${token}`;
    await sendVerificationEmail(email, verificationUrl);

    res.json({ success: true, message: 'Verification email resent successfully!' });
  } catch (error) {
    console.error('Resend Verification Error:', error);
    res.status(500).json({ success: false, message: 'Error resending verification email' });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
    const resetUrl = `${process.env.FRONTEND_URL}/#/reset-password/${resetToken}`;

    await sendResetPasswordEmail(email, resetUrl);

    res.json({ success: true, message: 'Password reset email sent!' });
  } catch (error) {
    next(error);
  }
};

// Actual password reset
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Hash new password and save
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password has been reset. Please log in.' });
  } catch (error) {
    next(error);
  }
};

