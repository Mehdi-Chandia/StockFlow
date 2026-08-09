import {email, z} from 'zod'
import { UserRole } from "../enums/user.enum.js"


export const registerUserSchema=z.object({
    firstName: z.string().min(2).max(15).trim(),
    lastName: z.string().min(2).max(15).trim(),
    email: z.email().toLowerCase(),
    role: z.nativeEnum(UserRole),
    warehouse: z.string()
    
})


export const loginSchema=z.object({
    email: z.email().toLowerCase(),
    password:z.string().min(8).max(100)
})


export const resetPasswordSchema=z.object({
    password:z.string().min(8).max(100),
    confirmPassword:z.string().min(8).max(100)
})

