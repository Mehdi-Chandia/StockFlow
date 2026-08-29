import type{ Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";


export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err)
    }

    return res.status(500).json({
        success:false,
        message: err || "internal server error"
    })
}

