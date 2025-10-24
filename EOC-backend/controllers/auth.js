import mongoose from "mongoose"
import User from '../models/User.js'
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

export const signUp = async (req,res,next) => {
    //implement signup logic here
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        //create a new user
        const {name, email, password,role} = req.body;

        const existingUser = await User.findOne({email})

        if(existingUser){
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{name, email, password: hashedPassword,role}],{session})

        const token = jwt.sign({ userId: newUsers[0]._id, role: newUsers[0].role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0],
            }
        })
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}


export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body; // role not needed from input
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Get role from user record directly
    const userRole = user.role;

    const token = jwt.sign(
      { userId: user._id, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: userRole,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};




export const signOut = async (req,res,next) => {
    
}
