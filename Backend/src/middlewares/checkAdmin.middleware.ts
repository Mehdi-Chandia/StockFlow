import type { Request, Response ,NextFunction } from "express";
import { UserRole } from "../enums/user.enum.js";
import ApiError from "../utils/ApiError.js";

export function isAdmin(req:Request, res: Response, next: NextFunction){

    let role=req?.user?.role;

    if (role !== UserRole.ADMIN) {
        throw new ApiError(403, "Forbidden: Admin access required")
    }
    
 next();
    
}