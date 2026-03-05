import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/connect.js';
import authRoutes from './routes/auth.js';
import playgroundRoutes from './routes/playground.js';
import blogRoutes from './routes/blog.js';

dotenv.config();

connectDB().catch((err) => console.error(err));

const app = express();

// CORS middleware - allow specific origin with credentials
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/playground', playgroundRoutes);
app.use('/api/blogs', blogRoutes);

app.get('/', (req, res) => {
  res.send(`GetBugged backend is running at port successfully`);
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
