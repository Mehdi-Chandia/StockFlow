
import z from "zod";

// update warehouse
export const EditWHschema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters").max(50).trim().optional(),

  email: z.union([
    z.email("Please enter a valid email"),
    z.literal(""),
  ]).optional(),

  phone: z.string().optional(),
  address: z.string().optional(),
  manager: z.string().optional(),
});

export type EditWareHouseFormData = z.infer<typeof EditWHschema>;

// create warehouse schema
export const createWHSchema= z.object({
    name: z.string().min(2).max(50).trim(),
    email: z.email().toLowerCase(),
    phone: z.string(),
    address: z.string(),
    city:z.string(),
    manager: z.string()
})

export type CreateWareHouseFormData= z.infer<typeof createWHSchema>
