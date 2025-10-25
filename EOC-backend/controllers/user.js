import User from '../models/User.js';

// Get current user profile
export const getUserProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware (contains user id)
    const user = await User.findById(req.user.id)
      .select('-password') // Exclude password
      .populate('registeredEvents', 'name date category'); // Populate events with basic info

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: error.message
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, year, bio } = req.body;

    // Find user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (year) user.year = year;
    if (bio !== undefined) user.bio = bio; // Allow empty string

    // Update avatar if name changed
    if (name) {
      user.avatar = name.charAt(0).toUpperCase();
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('registeredEvents', 'name date category');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: error.message
    });
  }
};

// Delete user account (optional)
export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account',
      error: error.message
    });
  }
};
