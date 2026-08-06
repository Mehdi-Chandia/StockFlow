import mongoose from "mongoose";

let isConnected=false;

export async function connectToDb() {
    try {
        const uri = process.env.MONGODB_URI;

      if (!uri) {
          throw new Error("MONGODB_URI is missing");
         }
        if (isConnected) return;

       await mongoose.connect(uri)
        isConnected=true

        console.log('Database connected successfully! ');
        
    } catch (error) {
        console.log(error);
        process.exit(1)
        
    }
}
