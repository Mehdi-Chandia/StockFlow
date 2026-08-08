import express from 'express'
import type { Express,Request,Response } from 'express'
import { errorHandler } from './middlewares/error.middleware.js'
import cookieParser from 'cookie-parser'
import userRoutes from "./routes/user.routes.js"

const app: Express= express()

// built in middlewares 

app.use(express.json({limit:'16kb'}))
app.use(cookieParser()) 


// user routes
app.use("/api/user", userRoutes)

app.get("/", (req: Request, res: Response):void =>{
    res.send("hello from teach ware! ")
})

app.use(errorHandler)

export default app;
