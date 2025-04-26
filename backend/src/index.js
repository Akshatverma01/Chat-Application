import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { app as socketApp, server } from "./utils/socket.js";

dotenv.config();
const app = socketApp;
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// app.get("/", (req, res) => {
//   res.send({
//     activeStatus: true,
//     error: false,
//   });
// });

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000; 
    server.listen(port, () => {
      console.log("Server is running on port " + port); 
    });
  })
  .catch((error) => {
    console.error("Mongoose connection error: ", error);
    process.exit(1);
  });

export default app;
