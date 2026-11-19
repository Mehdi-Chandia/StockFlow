import type{ Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";


export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    if (err instanceof ApiError) {
        console.log("================= error occured ===============\n");
        console.log(err.message);
        return res.status(err.statusCode).json(err)
    }
    console.log("================= error occured ===============\n");
    console.log(err);

    return res.status(500).json({
        success:false,
        message: err || "internal server error"
    })
}

