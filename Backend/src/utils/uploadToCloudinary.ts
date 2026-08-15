
import cloudinary from "../lib/cloudinary.js";
import fs from "fs"

export async function UploadToCloudinary(filePath: string){
    try {
        if (!filePath) {
            throw new Error("file path not provided")
        }

        console.log("uploading to cloudianry ");
        

        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })

        console.log("uploaded successfully ");
        

        fs.unlinkSync(filePath)

        console.log("cloudinary response:",response);       
        return response;
        
    } catch (error) {
        console.log("cloudinary error : ",error);
        fs.unlinkSync(filePath)
        throw error;
    }
}