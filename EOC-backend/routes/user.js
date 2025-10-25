import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  deleteUserAccount 
} from '../controllers/user.js';
import { protect } from '../middlewares/authMiddleware.js'; // Your auth middleware

const userRoutes = express.Router();

// All routes require authentication
userRoutes.use(protect);

// GET /api/users/profile - Get current user profile
userRoutes.get('/profile', getUserProfile);

// PATCH /api/users/profile - Update current user profile
userRoutes.patch('/profile', updateUserProfile);

// DELETE /api/users/account - Delete user account
userRoutes.delete('/account', deleteUserAccount);

export default userRoutes;
