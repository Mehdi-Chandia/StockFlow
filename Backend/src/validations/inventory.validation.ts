import {z} from "zod"
import { StockMovementReason, StockMovementType } from "../enums/stockMov.enums.js"

export const inventoryValidationSchema=z.object({
    productId: z.string(),
    warehouseId: z.string(),
    quantity: z.number().positive(),
    reorderlevel: z.number().positive(),
    
})


export const adjustInventorySchema= z.object({
    quantity: z.number(),
    type: z.nativeEnum(StockMovementType),
    reason: z.nativeEnum(StockMovementReason)
})