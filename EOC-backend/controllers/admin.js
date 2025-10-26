import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// List coordinators
export const getAllCoordinators = async (req, res) => {
  const coordinators = await User.find({ role: 'coordinator' }).select('-password');
  res.json(coordinators);
};

// Create new coordinator (admin only)
export const createCoordinator = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const coordinator = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'coordinator',
    isVerified: true,  // Admin-created coordinators verified automatically
  });

  res.status(201).json(coordinator);
};
