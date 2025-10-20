import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from './route/aiRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './route/userRoutes.js';

const app = express();
app.use(express.json());

await connectCloudinary();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(clerkMiddleware());


app.get('/', (req, res, next) => res.send('API is running...'));
app.use(requireAuth());
app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});