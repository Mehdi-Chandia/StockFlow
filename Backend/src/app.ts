import express from 'express'
import type { Express,Request,Response } from 'express'

const app: Express= express()

app.use(express.json())

app.get("/", (req: Request, res: Response):void =>{
    res.send("hello from teach ware! ")
})

export default app;
