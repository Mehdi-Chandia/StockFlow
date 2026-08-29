import z from "zod";

export const shipmentValidationSchema=z.object({
    purchaseOrderId: z.string(),
    warehouseId: z.string(),
    supplier: z.string(),
    items:z.array(
        z.object({
            productId: z.string(),
            expectedQty : z.number().nonnegative(),
            receivedQty : z.number().nonnegative(),
            damagedQty : z.number().nonnegative(),
            missingQty : z.number().nonnegative(),
            note: z.string()
       })
    ).min(1),
    receivedAt: z.coerce.date()
})