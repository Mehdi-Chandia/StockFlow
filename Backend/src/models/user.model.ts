import mongoose, { model } from "mongoose";
import { UserRole } from "../enums/user.enum.js";
import { UserStatus } from "../enums/user.enum.js";

interface IUser{
    _id?:mongoose.Types.ObjectId
    empID:string;
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    role:UserRole;
    warehouse?:mongoose.Types.ObjectId;
    status:UserStatus;
    mustChangePassword:boolean;
    createdBy?:mongoose.Types.ObjectId;
    lastLogin?:Date;
    avatar?:string;
    resetPasswordToken?:string;
    otpCode?:string;
    otpExpiresIn?:Date;
    resetPasswordExpiresIn?:Date;
    createdAt?:Date;
    updatedAt?:Date
}

const userSchema=new mongoose.Schema<IUser> ({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true 
    },
    empID:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
         type:String,
        required:true
    },
    role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.WORKER,
    },
    warehouse:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Warehouse",
        // required:true
    },
    status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.ACTIVE,
    },
    mustChangePassword:{
        type:Boolean,
        default:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    lastLogin:{
        type:Date
    },
    avatar:{
        type:String
    },
    resetPasswordExpiresIn:{
        type:Date
    },
    resetPasswordToken:{
        type:String
    },
    otpCode:{
        type:String
    },
    otpExpiresIn:{
        type:Date
    }

},{timestamps:true})

userSchema.index({
    email:1
})

userSchema.index({
    empId:1
})

userSchema.index({
    warehouse:1
})


const User= mongoose.model<IUser>("User", userSchema)

export default User;