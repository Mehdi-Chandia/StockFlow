import type { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { getSuppliersValidationSchema, supplierValidationSchema } from "../validations/supplier.validation.js";
import { formatZodErrors } from "../utils/formatZodErrors.js";
import ApiError from "../utils/ApiError.js";
import Supplier from "../models/supplier.model.js";
import { SupplierStatus } from "../enums/supplier.enum.js";
import ApiResponse from "../utils/ApiResponse.js";
import { updateSupplierValidationSchema } from "../validations/supplier.validation.js";
import { pagination } from "../utils/pagination.js";
import mongoose from "mongoose";
import type { IAuditLog } from "../models/auditLog.model.js";
import { AuditAction, AuditEntityType } from "../enums/auditLog.enum.js";
import { createAuditLog } from "../utils/auditLog/createAuditLog.js";


// create supplier
export const createSupplier= AsyncHandler(async (req: Request, res: Response)=>{
    const {name, email, phone, address, city, categories, companyName}= req.body;

    const validation= supplierValidationSchema.safeParse(req.body);

    if (!validation.success) {
        const errors= formatZodErrors(validation.error)

        throw new ApiError(400, "validation failed", errors)
    }

    const newSupplier= await Supplier.create({
        name,
        email,
        address,
        phone,
        city,
        categories,
        companyName,
        createdBy: req.user.id,
        status: SupplierStatus.ACTIVE
    })

    if (!newSupplier) {
        throw new ApiError(500, "error while creating new Supplier")
    }

    const auditLogData={
        action: AuditAction.CREATE,
        entityType: AuditEntityType.SUPPLIER,
        entityId: newSupplier._id,
        reason: "created a new supplier ",
        performedBy: req.user.id,
    }

    await createAuditLog(auditLogData);

    return res.status(201).json(
        new ApiResponse(201, "new Supplier created", newSupplier)
    )

})

// get supplier
export const getSupplier= AsyncHandler(async (req: Request, res: Response)=>{
    const {supplierId}= req.params;

    if (!supplierId) {
        throw new ApiError(400, "supplierId is required")
    }

    if (!mongoose.isValidObjectId(supplierId)) {
    throw new ApiError(400, "invalid supplier ID");
    }

    const supplier= await Supplier.findById(supplierId);

    if (!supplier) {
        throw new ApiError(404, "supplier not found")
    }   

    return res.status(200).json(
        new ApiResponse(200, "supplier found", supplier)
    )
});

// inactivate supplier
export const inactivateSupplier= AsyncHandler(async (req: Request, res: Response)=>{
    const {supplierId}= req.params; 

    if (!supplierId) {
        throw new ApiError(400, "supplierId is required")
    }

    const supplier= await Supplier.findById(supplierId);

    if (!supplier) {
        throw new ApiError(404, "supplier not found")
    }

    supplier.status= SupplierStatus.INACTIVE;

    await supplier.save();

    const auditLogData={
        action: AuditAction.BLOCK,
        entityType: AuditEntityType.SUPPLIER,
        entityId: supplier._id,
        reason: "inactivated a supplier ",
        performedBy: req.user.id,
        changes:{
            status:{
                old: SupplierStatus.ACTIVE,
                new: SupplierStatus.INACTIVE
            }
        }
    }

    await createAuditLog(auditLogData)

    return res.status(200).json(
        new ApiResponse(200, "supplier inactivated", supplier)
    )
});

// update supplier
export const updateSupplier= AsyncHandler(async (req: Request, res: Response)=>{
    const {supplierId}= req.params;

    if (!supplierId) {
        throw new ApiError(400, "supplierId is required")
    }

    const validation= updateSupplierValidationSchema.safeParse(req.body);

    if (!validation.success) {
        const errors= formatZodErrors(validation.error) 

        throw new ApiError(400, "validation failed", errors)
    }

    const supplier= await Supplier.findByIdAndUpdate(
        supplierId,
        {
            $set: validation.data
        },{new: true}
    );

    if (!supplier) {
        throw new ApiError(404, "supplier not found")
    }

    const auditLogData={
        action: AuditAction.UPDATE,
        entityType: AuditEntityType.SUPPLIER,
        entityId: supplier._id,
        reason: "updated a supplier ",
        performedBy: req.user.id,
    }

    await createAuditLog(auditLogData);

    return res.status(200).json(
        new ApiResponse(200, "supplier updated", supplier)
    )
})

// get suppliers with pagination and filtering
export const getSuppliers= AsyncHandler(async (req: Request, res: Response)=>{
    const {name, companyName, categories, city, status}= req.query;

    const validation= getSuppliersValidationSchema.safeParse(req.query);
    if (!validation.success) {
        const errors= formatZodErrors(validation.error)

        throw new ApiError(400, "validation failed", errors)
    }


    const {page, limit, skip}= pagination({
        Page:req.query.page?.toString(), 
        Limit:req.query.limit?.toString()
    })

    const filter:any={}

    if (name) {
        filter.name= name
    }
    if (companyName) {
        filter.companyName= companyName
    }
    if (city) {
        filter.city= city
    }
    if (categories) {
        filter.categories= categories
    }

    const suppliers= await Supplier.find(filter)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)

    if (suppliers.length === 0) {
        throw new ApiError(400, "invalid details provided no supplier found")
    }

    const totalRecords= await Supplier.countDocuments(filter)
    const totalPages= Math.ceil(totalRecords/limit)
    const hasNextPage= page < totalPages;
    const hasPrevPage= page > 1

    const data={
        suppliers,
        pagination:{
            totalRecords,
            totalPages,
            hasNextPage,
            hasPrevPage,
            currentPage: page,
            limit
        }
    }

    return res.status(200).json(
        new ApiResponse(200, "suppliers found", data)
    )

})
 
