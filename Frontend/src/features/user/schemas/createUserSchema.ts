import {z} from "zod";

export const UserRole = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  WORKER: "WORKER",
  SALES_MANAGER: "SALES_MANAGER",
  ACCOUNTANT: "ACCOUNTANT",
} as const;


export const createUserSchema= z.object({
    firstName: z.string().min(2, 'firstName must be atleast 2 char'),
    lastName: z.string().min(2, 'lastName must be atleast 2 char'),
    email: z.email(),
    role: z.enum(UserRole, "please select a role"),
    warehouse: z.string().min(1, "plase select a warehouse")
})

export type createUserData= z.infer<typeof createUserSchema>

