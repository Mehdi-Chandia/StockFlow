import type { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import AuditLog from "../models/auditLog.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { pagination } from "../utils/pagination.js";
import mongoose from "mongoose";
import { AuditEntityType } from "../enums/auditLog.enum.js";



export const getAudit= AsyncHandler(async (req:Request, res:Response)=>{
    const {auditId}= req.params;

    if (!auditId) {
        throw new ApiError(400, "audit ID not found")
    }

    const audit= await AuditLog.findById(auditId);

    if (!audit) {
        throw new ApiError(400, "invalid audit ID")
    }

    return res.status(200).json(
        new ApiResponse(200, "audit log found", audit)
    )
})


export const getAudits= AsyncHandler(async (req:Request, res:Response)=>{
    const {entityType, entityId, performedBy}= req.query;

    const{limit, page, skip}= pagination({
        Page:req.query.page?.toString(), 
        Limit:req.query.limit?.toString()
    })

    if (
        (entityId && !mongoose.isValidObjectId(entityId) ||
         (performedBy && !mongoose.isValidObjectId(performedBy)))
        ) {
        throw new ApiError(400, "invalid IDs")
    }

    if (entityType && !Object.values(AuditEntityType).includes(entityType as AuditEntityType)) {
        throw new ApiError(400, "invalid audit entity type")
    }

    const filter: any={}

    if (entityType) {
        filter.entityType= entityType
    }
    if (entityId) {
        filter.entityId= entityId
    }

    if (performedBy) {
        filter.performedBy= performedBy
    }

    const audits= await AuditLog.find(filter)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)

    if (audits.length === 0) {
        throw new ApiError(404, "no audit logs found")
    }

    const totalRecords= await AuditLog.countDocuments(filter)
    const totalPages= Math.ceil(totalRecords/limit)
    const hasNextPage= page < totalPages
    const hasPrevPage= page > 1
    
    const data={
        audits,
        pagination:{
            totalRecords,
            totalPages,
            currentPage: page,
            hasNextPage,
            hasPrevPage,
            page,
            limit
        }
    }

    return res.status(200).json(
        new ApiResponse(200, "audit logs found", data)
    )
})