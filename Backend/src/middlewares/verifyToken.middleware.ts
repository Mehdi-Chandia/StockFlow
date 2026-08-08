import type { Response, Request, NextFunction } from "express"
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import type { UserRole } from "../enums/user.enum.js";

export interface jwtPayload{
    id: string;
    email:string;
    role:UserRole
}

export const verifyToken=async (req: Request, res:Response, next:NextFunction)=>{
    try {
        const token= req.cookies.token

        if (!token) {
            throw new ApiError(401, "user is not authenticated")
        }

        const decode=jwt.verify(token, process.env.JWT_SECRET!) as jwtPayload

        const user= await User.findById(decode.id.toString())

        if (!user) {
            throw new ApiError(404,"user not found")
        }

        req.user=user;

        next()

    } catch (error) {
        console.log(error);
        next(error)
    }
}