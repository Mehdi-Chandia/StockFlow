import type { Response, Request, NextFunction } from "express"
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import type { UserRole } from "../enums/user.enum.js";
import type { jwtPayload } from "../enums/constants.js";


export const verifyToken=async (req: Request, res:Response, next:NextFunction)=>{
    try {
        const token= req?.cookies?.["access-token"]

        if (!token) {
            throw new ApiError(401, "user is not authenticated")
        }

        const decode=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwtPayload;

        if (decode.tokenType !== "access") {
            throw new ApiError(400, "invalid token type")
        }

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