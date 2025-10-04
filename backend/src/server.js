import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import userRoutes from "./routes/user_route.js";
import authRoutes from "./routes/auth_route.js";     
import chatRoutes from "./routes/chat_route.js";

import { connectDB } from "./library/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
