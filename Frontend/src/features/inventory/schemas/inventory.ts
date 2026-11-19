import z from "zod";

export const createInventorySchema=z.object({
    productId: z.string(),
    warehouseId: z.string(),
    quantity: z.number(),
    reorderlevel: z.number().positive(),
})

export type CreateInventoryFormData=z.infer<typeof createInventorySchema>