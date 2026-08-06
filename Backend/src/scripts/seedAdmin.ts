import dotenv from "dotenv"
dotenv.config()
import { connectToDb } from "../config/db.js"
import User from "../models/user.model.js"
import { UserStatus } from "../enums/user.enum.js"
import { UserRole } from "../enums/user.enum.js"
import bcrypt from "bcrypt"
import mongoose from "mongoose"


const generateAdmin= async () => {
    try {

        const adminEmail=process.env.ADMIN_EMAIL!
        const adminPassword=process.env.ADMIN_PASSWORD!
        const adminFirstName=process.env.ADMIN_FIRST_NAME!
        const adminLastName=process.env.ADMIN_LAST_NAME!

        await connectToDb();
        
        let hashPassword=await bcrypt.hash(adminPassword,10)


        const isAdminExist=await User.findOne({
            role:UserRole.ADMIN
        })

        if (isAdminExist) {
            throw new Error("admin already exists")
        
        }
        
          await User.create({
            firstName:adminFirstName,
            lastName:adminLastName,
            password:hashPassword,
            email:adminEmail,
            role:UserRole.ADMIN,
            empID:"EMP-ADMIN-01",
            status:UserStatus.ACTIVE,
            mustChangePassword:false

        })

        console.log("admin created successfully");
        await mongoose.disconnect();

    } catch (error) {
        console.error("error in admin seed file ",error)
    }
}


generateAdmin()
