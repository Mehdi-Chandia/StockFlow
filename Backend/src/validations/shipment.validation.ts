import z from "zod";

export const shipmentValidationSchema=z.object({
    purchaseOrderId: z.string(),
    items:z.array(
        z.object({
            productId: z.string(),
            receivedQty : z.number().nonnegative(),
            damagedQty : z.number().nonnegative(),
            note: z.string()
       })
    ).min(1),
    receivedAt: z.coerce.date()
})
