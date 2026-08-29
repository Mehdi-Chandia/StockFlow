import express from 'express'
import type { Express,Request,Response } from 'express'
import { errorHandler } from './middlewares/error.middleware.js'
import cookieParser from 'cookie-parser'
import userRoutes from "./routes/user.routes.js"
import wareHouseRoutes from "./routes/wareHouse.routes.js"
import productRoutes from "./routes/product.routes.js"
import inventoryRoutes from "./routes/inventory.routes.js"
import orderRoutes from "./routes/order.routes.js"
import stockMovementsRoutes from "./routes/stockMovements.routes.js"
import auditLogRoutes from "./routes/auditLog.routes.js"
import purchaseOrderRoutes from "./routes/purchaseOrder.routes.js"

const app: Express= express()

// built in middlewares 
app.use(express.json({limit:'16kb'}))
app.use(cookieParser()) 


// user route handler 
app.use("/api/user", userRoutes)
// warehouse route handler
app.use("/api/warehouse",wareHouseRoutes)
// product routes handler
app.use("/api/products", productRoutes)
// inventory routes
app.use("/api/inventory", inventoryRoutes)
// order routes
app.use("/api/order", orderRoutes)
// stock movement routes
app.use("/api/stock-movements", stockMovementsRoutes)
// audit log routes
app.use("/api/audit-logs", auditLogRoutes)
// purchase order routes
app.use("/api/purchase-order", purchaseOrderRoutes)


app.get("/health-check", (req: Request, res: Response):void =>{
    res.send("stock flow is running fine! ")
})

app.use(errorHandler)

export default app;
