import {z} from "zod"

export const inventoryValidationSchema=z.object({
    productId: z.string(),
    warehouseId: z.string(),
    quantity: z.number(),
    reorderlevel: z.number(),
    
})