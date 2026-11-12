import { z } from "zod";

// edit product validation
export const editProductSchema = z
  .object({
    name: z.string().trim().min(1, "Product name is required"),
    category: z.string().min(1, "Please select a category"),
    brand: z.string().trim().min(1, "Brand is required"),
    purchasePrice: z.number().finite().min(0, "Price cannot be negative"),
    sellPrice: z.number().finite().min(0, "Price cannot be negative"),
    minQty: z.number().int().min(0, "Minimum quantity cannot be negative"),
    maxQty: z.number().int().min(0, "Maximum quantity cannot be negative"),
    description: z.string(),
  })
  .refine((data) => data.minQty <= data.maxQty, {
    message: "Minimum quantity cannot exceed maximum quantity",
    path: ["minQty"],
  });

export type EditProductFormData = z.infer<typeof editProductSchema>;


// create product validation
export const createProductSchema = z
  .object({
    name: z.string().trim().min(1, "Product name is required"),
    category: z.string().min(1, "Please select a category"),
    brand: z.string().trim().min(1, "Brand is required"),
    purchasePrice: z.number().finite().min(0, "Price cannot be negative"),
    sellPrice: z.number().finite().min(0, "Price cannot be negative"),
    minQty: z.number().int().min(0, "Minimum quantity cannot be negative"),
    maxQty: z.number().int().min(0, "Maximum quantity cannot be negative"),
    description: z.string(),
  })
  .refine((data) => data.minQty <= data.maxQty, {
    message: "Minimum quantity cannot exceed maximum quantity",
    path: ["minQty"],
  });

export type CreateProductFormData = z.infer<typeof createProductSchema>