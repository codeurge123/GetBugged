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


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.CLIENT_URL,
      "https://getbugged.codeurge.online",
      /\.vercel\.app$/  // Allow all Vercel deployments
    ],
    credentials: true
  })
);

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/playground", playgroundRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
  res.send("GetBugged backend is running successfully");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});