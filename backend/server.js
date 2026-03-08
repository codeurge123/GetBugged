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

// CORS - use env for flexible deployment (comma-separated origins)
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://getbugged.codeurge.online', // production frontend level
];

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : defaultOrigins;

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    if (process.env.NODE_ENV === 'development') return cb(null, true);
    cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

// Handle OPTIONS preflight FIRST - must return 200 for CORS (Vercel serverless)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }
  next();
});

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
