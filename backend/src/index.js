import express from "express";
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {connectDB} from "./lib/db.js"

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"


dotenv.config();
const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
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