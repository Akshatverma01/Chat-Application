import express from "express";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { app as socketApp, server } from "./utils/socket.js";

dotenv.config();

// Here, you can use either 'app' from socket.js or create a fresh one.
// But for now, let's use socketApp
const app = socketApp;
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // Change to production frontend URL later
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get('/', (req, res) => {
    res.send({
        activeStatus: true,
        error: false,
    });
});

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

connectDB();
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
// DO NOT call server.listen() here!

export default app;
