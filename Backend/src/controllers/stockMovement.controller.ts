import type { Request ,Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import StockMovement from "../models/stockMovement.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { StockMovementReason, StockMovementType } from "../enums/stockMov.enums.js";
import mongoose from "mongoose";


// get all movements handler
export const getAllMovements= AsyncHandler(async (req:Request, res:Response)=>{

    const {productId, warehouseId, performedBy, type, reason}= req.query;
    const page= Math.max(Number(req.query.page) || 1, 1)
    const limit= Math.min( Math.max(Number(req.query.limit) || 10, 1), 100 )

    const skip= (page - 1 ) * limit;

    if (type && !Object.values(StockMovementType).includes(type as StockMovementType)) {
        throw new ApiError(400, "invalid type")
    }

     if (reason && !Object.values(StockMovementReason).includes(reason as StockMovementReason)) {
        throw new ApiError(400, "invalid reason")
    }

     if (
    (productId && !mongoose.isValidObjectId(productId)) ||
    (warehouseId && !mongoose.isValidObjectId(warehouseId)) ||
    (performedBy && !mongoose.isValidObjectId(performedBy))
     ) {
    throw new ApiError(400, "Invalid ID");
    }

    const filter: any={}

    if (productId) {
        filter.productId= productId
    }
    if (warehouseId) {
        filter.warehouseId= warehouseId
    }
    if (performedBy) {
        filter.performedBy= performedBy
    }
    if (type) {
        filter.type= type
    }
    if (reason) {
        filter.reason= reason
    }


     const movements= await StockMovement.find(filter)
     .sort({createdAt: -1})
     .skip(skip)
     .limit(limit)  
     
     
     if (movements.length === 0) {
         throw new ApiError(404, "no stock movements found! ")
        }
        
    const totalRecords= await StockMovement.countDocuments(filter);
    const totalPages= Math.ceil(totalRecords / limit)
    const hasNextPage= page < totalPages;
    const hasPrevPage= page > 1;


    const data={
        movements,
        totalRecords,
        totalPages,
        page,
        limit,
        hasNextPage,
        hasPrevPage

    }

    return res.status(200)
    .json(
        new ApiResponse(200, "stock movements found! ", data)
    )


})

// get movement by id
export const getMovement= AsyncHandler(async (req:Request, res:Response)=>{

    const {stockMovementId}= req.params;
    if (!stockMovementId) {
        throw new ApiError(400, "stock movement id not found")
    }

    const movement= await StockMovement.findById(stockMovementId)

    if (!movement) {
       throw new ApiError(404, "stock movement not found")  
    }

    return res.status(200)
    .json(
        new ApiResponse(200, "stock movement found", movement)
    )

})


// get the movement history of product
export const getProductMovement= AsyncHandler(async (req:Request, res:Response)=>{
    const {productId}= req.params;

    if (!productId) {
       throw new ApiError(400, "product id not provided")
    }

   const productsMovement= await StockMovement.find({productId: productId})

   if (productsMovement.length === 0) {
     throw new ApiError(404, "No stock movement found for this product")
   }

   return res.status(200)
   .json(
    new ApiResponse(200, "stock movements found for this product!", productsMovement)
   )

})


// get the movement history of warehouse
export const getWareHouseMovement= AsyncHandler(async (req:Request, res:Response)=>{
    const {warehouseId}= req.params;

    if (!warehouseId) {
       throw new ApiError(400, "product id not provided")
    }

   const warehouseMovement= await StockMovement.find({warehouseId: warehouseId})

   if (warehouseMovement.length === 0) {
     throw new ApiError(404, "No stock movement found for this warehouse")
   }

   return res.status(200)
   .json(
    new ApiResponse(200, "stock movements found for this warehouse!", warehouseMovement)
   )
   
})