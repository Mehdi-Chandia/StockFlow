import type { Response, Request, NextFunction, } from "express"

type AsyncController=(
    req:Request,
    res:Response,
    next:NextFunction
) => Promise<unknown>

export const AsyncHandler= (fn: AsyncController)=> async (req, res, next)=> {
    try {
       return await fn(req, res, next)
    } catch (error:any) {
        return res.status(500).json({
            success:false,
            message:error.message
        }) 
    }
}