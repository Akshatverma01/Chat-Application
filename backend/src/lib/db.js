import mongoose from "mongoose";

const connectDB = async ()=>{
     try {
        const connect  = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB connectd: ${connect.connection.host}` )
     } catch (error) {
            console.log(`MongoDb connected error: ${error}` );
            throw new Error(error.message||"Error connecting to database");
     }
}

export {connectDB};