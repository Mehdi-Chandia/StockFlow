import type { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { purchaseOrderValidationSchema, updatePurchaseOrderValidationSchema } from "../validations/purchaseOrder.validation.js";
import { formatZodErrors } from "../utils/formatZodErrors.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import { generatePOID } from "../utils/generatePoId.js";
import { PurchaseOrderStatus } from "../enums/purchaseOrder.enum.js";
import { AuditAction, AuditEntityType } from "../enums/auditLog.enum.js";
import { createAuditLog } from "../utils/auditLog/createAuditLog.js";
import ApiResponse from "../utils/ApiResponse.js";
import { pagination } from "../utils/pagination.js";
import mongoose from "mongoose";




// create purchase order
export const createPurchaseOrder= AsyncHandler(async (req:Request, res:Response)=>{
    const {warehouseId, supplierId, expectedAt, items}= req.body;

    if (items.length === 0) {
        throw new ApiError(400, "items can't be empty")
    }

    const validation= purchaseOrderValidationSchema.safeParse(req.body)

    if (!validation.success) {
        const errors= formatZodErrors(validation.error)

        throw new ApiError(400, "validation failed ", errors)
    }


    const poId= generatePOID();

    const newPO=await PurchaseOrder.create({
        poId,
        warehouseId,
        supplierId,
        items,
        createdBy: req.user.id,
        expectedAt,
        status: PurchaseOrderStatus.PENDING
    })

    if (!newPO) {
        throw new ApiError(500, "error while creating PO")
    }

    const auditLogData={
        action: AuditAction.CREATE,
        entityType: AuditEntityType.PURCHASE_ORDER,
        entityId: newPO._id,
        reason: "created new purchase order",
        performedBy: req.user.id,

    }

    await createAuditLog(auditLogData)

    return res.status(201).json(
        new ApiResponse(201, "purchase order created", newPO)
    )
})

// get PO by ID
export const getPurchaseOrder= AsyncHandler(async (req:Request, res:Response)=>{
    const {poId}= req.params;

    if (!poId) {
        throw new ApiError(400, "PO ID not found")
    }

    const po= await PurchaseOrder.findById(poId)

    if (!po) {
        throw new ApiError(400, "invalid po ID")
    }

    return res.status(200).json(
        new ApiResponse(200, "purchase order found ", po)
    )
})

// get POs by filtering and pagination
export const getPurchaseOrders= AsyncHandler(async (req:Request, res:Response)=>{
    const {warehouseId, supplierId, status, productId}= req.query;

    const {page, limit, skip}= pagination({
        Page: req.query.page?.toString(), 
        Limit: req.query.limit?.toString()
    })

    if ((
        warehouseId && !mongoose.isValidObjectId(warehouseId) || 
        supplierId && !mongoose.isValidObjectId(supplierId) || 
        productId && !mongoose.isValidObjectId(productId))) {
        
            throw new ApiError(400, "invalid Ids")
    }

    if (status && !Object.values(PurchaseOrderStatus).includes(status as PurchaseOrderStatus)) {
        throw new ApiError(400, "invalid status type")
    }

    const filter:any={}

    if (warehouseId) {
        filter.warehouseId= warehouseId
    }
    if (supplierId) {
        filter.supplierId= supplierId
    }
    if (productId) {
        filter["items.productId"] = productId;
    }
    if (status) {
        filter.status= status
    }

    const POs= await PurchaseOrder.find(filter)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)

    if (POs.length === 0) {
        throw new ApiError(400, "purchase orders not found")
    }

    const totalRecords= await PurchaseOrder.countDocuments(filter)
    const totalPages= Math.ceil(totalRecords/limit)
    const hasNextPage= page < totalPages
    const hasPrevPage= page > 1

    const data={
        POs,
        pagination:{
            totalRecords,
            totalPages,
            hasNextPage,
            hasPrevPage,
            currentPage: page,
            limit,

        }
    }

    return res.status(200).json(
        new ApiResponse(200, "purchase orders found", data)
    )

})

// cancel PO
export const cancelPurchaseOrder= AsyncHandler(async (req:Request, res:Response)=>{
    const{poId}= req.params;

    if (!poId) {
        throw new ApiError(400, "PO Id not found")
    }

    const po= await PurchaseOrder.findById(poId)
    if (!po) {
        throw new ApiError(400, "invalid PO Id")
    }

    const prevStatus= po.status;

    if (po.status === PurchaseOrderStatus.CANCELLED || po.status === PurchaseOrderStatus.RECEIVED) {
        throw new ApiError(400, "can't cancel the PO")
    }

    po.status= PurchaseOrderStatus.CANCELLED;
    await po.save();

    const auditLogData={
        action: AuditAction.CANCEL,
        entityType: AuditEntityType.PURCHASE_ORDER,
        entityId: po._id,
        performedBy: req.user.id,
        reason: "cancelled the purchase order",
        changes:{
            status:{
                old: prevStatus,
                new: PurchaseOrderStatus.CANCELLED
            }
        }
    }

    await createAuditLog(auditLogData)

    return res.status(200).json(
        new ApiResponse(200, "purchase order cancelled ", po)
    )
})

// update purchase order
export const updatePurchaseOrder= AsyncHandler(async (req: Request, res: Response)=>{
    const {poId}= req.params;

    if (!poId) {
        throw new ApiError(400, "purchase order ID not found")
    }

    const validation= updatePurchaseOrderValidationSchema.safeParse(req.body)

    if (!validation.success) {
        const errors= formatZodErrors(validation.error)

        throw new ApiError(400, "validation failed ", errors)
    }

    const updatedPO= await PurchaseOrder.findByIdAndUpdate(
        poId,
        {
            $set: validation.data
        }, {new: true}
    )

    if (!updatedPO) {
        throw new ApiError(500, "error while updating PO")
    }

    const auditLogData={
        action: AuditAction.UPDATE,
        entityType: AuditEntityType.PURCHASE_ORDER,
        entityId: updatedPO._id,
        reason: "updated the purchase order ",
        performedBy: req.user.id,
        
    }

    await createAuditLog(auditLogData)

    return res.status(200).json(
        new ApiResponse(200, "purchase order updated successfully ", updatedPO)
    )
})

// approve PO
export const approvePurchaseOrder= AsyncHandler(async (req:Request, res:Response)=>{
    const {poId}= req.params;

    if (!poId) {
        throw new ApiError(400, "PO ID not found")
    }

    const po= await PurchaseOrder.findById(poId)

    if (!po) {
        throw new ApiError(400, "invalid PO ID")
    }

    if (po.status !== PurchaseOrderStatus.PENDING) {
        throw new ApiError(400, "PO is already approved or cancelled")
    }

    po.status= PurchaseOrderStatus.APPROVED;
    await po.save();

     const auditLogData={
        action: AuditAction.UPDATE,
        entityType: AuditEntityType.PURCHASE_ORDER,
        entityId: po._id,
        reason: "approved the purchase order ",
        performedBy: req.user.id,
        changes:{
            POstatus:{
            old: PurchaseOrderStatus.PENDING,
            new: PurchaseOrderStatus.APPROVED
            }
        }
        
    }

    await createAuditLog(auditLogData)

    return res.status(200).json(
        new ApiResponse(200, "PO approved successfully ", po)
    )
})