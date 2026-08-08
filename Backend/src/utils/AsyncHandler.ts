import type { Request, Response, RequestHandler, NextFunction } from "express"


export const AsyncHandler = (fn: RequestHandler)=> 
    (async (req: Request, res: Response, next: NextFunction)=>{
        try {
            return await fn(req, res, next);
        } catch (error) {
            next(error)
        }
})