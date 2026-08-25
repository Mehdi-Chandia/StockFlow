import type { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Invoice from "../models/invoice.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { pagination } from "../utils/pagination.js";
import mongoose from "mongoose";


export const getInvoice= AsyncHandler(async (req:Request, res:Response)=>{
    const {invoiceId}= req.params;

    if (!invoiceId) {
        throw new ApiError(400, "invoice id not found")
    }

    const invoice= await Invoice.findById(invoiceId)

    if (!invoice) {
        throw new ApiError(400, "invalid invoice Id")
    }

    return res.status(200).json(
        new ApiResponse(200, "invoice found", invoice)
    )
})


// get the invoices with pagination and filtering

export const getInvoices= AsyncHandler(async (req: Request, res: Response)=>{
    const {warehouseId, customerName, issuedBy, orderId}= req.query;

    const {page, limit, skip}= pagination({
        Page:req.query.page?.toString(), 
        Limit:req.query.limit?.toString()
    });

    if ((warehouseId && !mongoose.isValidObjectId(warehouseId)) || 
        (issuedBy && !mongoose.isValidObjectId(issuedBy)) || 
        (orderId && !mongoose.isValidObjectId(orderId))) {
        throw new ApiError(400, "invalid IDs")
    }

    const filter:any={};

    if (warehouseId) {
        filter.warehouseId= warehouseId
    }
    if (issuedBy) {
        filter.issuedBy= issuedBy
    }
    if (customerName) {
        filter.customerName= customerName
    }

    const invoices= await Invoice.find(filter)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)

    if (invoices.length === 0) {
        throw new ApiError(400, "invalid data provided | no invoices found")
    }

    const totalRecords= await Invoice.countDocuments(filter)
    const totalPages= Math.ceil(totalRecords/limit);
    const hasPrevPage= page > 1;
    const hasNextPage= page < totalPages;

    const data={
        invoices,
        page,
        limit,
        totalRecords,
        totalPages,
        hasNextPage,
        hasPrevPage
    }

    return res.status(200).json(
        new ApiResponse(200, "invoices found ", data)
    )
})