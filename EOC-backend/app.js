import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import connectDB from './database/mongodb.js';

import authRoutes from './routes/auth.js'
import eventRoutes from './routes/event.js';
import userRoutes from './routes/user.js';


import errorMiddleware from './middlewares/error.js';



const app = express()

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json())


app.get('/',(req,res)=>{
    res.status(200).json({
        'data':'Welcome to EOC backend routes'
    })
})



app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/events',eventRoutes)
app.use('/api/v1/users',userRoutes)


app.use(errorMiddleware);





app.listen(5000,()=>{
    console.log(`EOC is running on ${PORT}!!!!`);
    connectDB();
})