import {coerce, z} from "zod"

export const purchaseOrderValidationSchema= z.object({
    warehouseId:z.string(),
    supplierId:z.string(),
    expectedAt: z.coerce.date(),
    items:z.array(
        z.object({
            productId: z.string(),
            quantity: z.number()
        })
    ).min(1, "items can't be empty")
    
})


export const updatePurchaseOrderValidationSchema= z.object({
    warehouseId:z.string().optional(),
    supplierId:z.string().optional(),
    expectedAt: z.coerce.date().optional(),
    items:z.array(
        z.object({
            productId: z.string(),
            quantity: z.number()
        })
    ).optional()
})
