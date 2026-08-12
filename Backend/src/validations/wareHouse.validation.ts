import { email, z } from 'zod'

export const WareHouseValidationSchema= z.object({
    name: z.string().min(2).max(50).trim(),
    email: z.email().toLowerCase(),
    phone: z.string(),
    address: z.string(),
    city:z.string(),
    manager: z.string()
})

export const updateWHschema=z.object({
    name: z.string().min(2).max(50).trim().optional(),
    email: z.email().toLowerCase().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    manager: z.string().optional()    
})

