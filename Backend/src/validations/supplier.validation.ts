import z from "zod";
import { SupplierCategory, SupplierStatus } from "../enums/supplier.enum.js";

export const supplierValidationSchema= z.object({
    name: z.string(),
    email: z.email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    categories:z.array(
        z.enum(SupplierCategory)
    ),
    companyName: z.string()
})


export const updateSupplierValidationSchema= z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    categories:z.array(
        z.enum(SupplierCategory)
    ).optional(),
    companyName: z.string().optional()
})


export const getSuppliersValidationSchema= z.object({
    name: z.string().optional(),
    city: z.string().optional(),
    categories:z.array(
        z.enum(SupplierCategory)
    ).optional(),
    companyName: z.string().optional(),
    status: z.enum(SupplierStatus).optional()
})



