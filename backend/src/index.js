import express from "express";
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import {connectDB} from "./lib/db.js"

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"


dotenv.config();
const app = express();
app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);


connectDB()
.then(()=>{
    app.listen(PORT, ()=>{
        console.log("Server started at "+PORT)
    });
})
.catch((error)=>{
    console.error("Mongoose connection error: ", error);
    process.exit(1);
})


export default app;