import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connect.js";
import authRoutes from "./routes/auth.js";
import playgroundRoutes from "./routes/playground.js";
import blogRoutes from "./routes/blog.js";

dotenv.config();

connectDB().catch((err) => console.error(err));

const app = express();

// allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://getbugged.codeurge.online"
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// enable cors
app.use(cors(corsOptions));

// handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/playground", playgroundRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
  res.send("GetBugged backend is running successfully");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});