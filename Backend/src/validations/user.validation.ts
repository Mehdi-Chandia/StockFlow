import {email, z} from 'zod'
import { UserRole } from "../models/user.model.js"


export const registerUserSchema=z.object({
    firstName: z.string().min(2).max(15).trim(),
    lastName: z.string().min(2).max(15).trim(),
    email: z.email().toLowerCase(),
    role: z.nativeEnum(UserRole),
    warehouse: z.string()
    
})

