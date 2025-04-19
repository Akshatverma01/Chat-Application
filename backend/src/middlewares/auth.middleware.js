import jwt from "jsonwebtoken"
import User from "../models/user.model.js";


export const protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.accessToken;
     
        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        if(!decoded){
            return res.status(401).json({message:"Unauthorized - Invalid token"});
        }
        const user = await User.findById(decoded.id).select("-password")
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        req.user = user;
        next();

    } catch (error) {
        console.log(error.message)
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - Token expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
        throw error; 
    }
}