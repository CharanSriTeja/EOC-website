import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const corsOptions = {
  origin: 'https://eoc-website.vercel.app',
  credentials: true,
};



import connectDB from './database/mongodb.js';

import authRoutes from './routes/auth.js'
import eventRoutes from './routes/event.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';


import errorMiddleware from './middlewares/error.js';



const app = express()

app.use(cors(corsOptions));
app.get('/',(req,res)=>{
    res.status(200).json({
        'data':'Welcome to EOC backend routes'
    })
})


app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/events',eventRoutes)
app.use('/api/v1/users',userRoutes)


app.use(errorMiddleware);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
