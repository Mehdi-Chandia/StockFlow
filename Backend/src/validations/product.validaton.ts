import {date, z} from 'zod'

export const productValidationSchema = z.object({
    name: z.string().min(2).max(50).trim(),
    category: z.string().min(2).trim(),

    purchasePrice: z.coerce.number().positive(),
    sellPrice: z.coerce.number().positive(),

    minQty: z.coerce.number().int().nonnegative(),
    maxQty: z.coerce.number().int().nonnegative(),

    description: z.string().optional(),
    brand: z.string().min(2).trim()
}).refine(
    data => data.minQty <= data.maxQty,
    {
        message: "minimum quantity cannot be greater than maximum quantity",
        path: ["minQty"]
    }
);

export const updateProductValidationSchema= z.object({
    name: z.string().min(2).max(50).trim().optional(),
    category: z.string().min(2).trim().optional(),

    purchasePrice: z.coerce.number().positive().optional(),
    sellPrice: z.coerce.number().positive().optional(),

    minQty: z.coerce.number().int().nonnegative().optional(),
    maxQty: z.coerce.number().int().nonnegative().optional(),

    description: z.string().optional(),
    brand: z.string().min(2).trim().optional()
})