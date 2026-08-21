import type { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { adjustInventorySchema, inventoryValidationSchema } from "../validations/inventory.validation.js";
import { formatZodErrors } from "../utils/zodErrors.js";
import ApiError from "../utils/ApiError.js";
import Inventory from "../models/inventory.model.js";
import { InventoryStatus } from "../enums/inventory.enum.js";
import ApiResponse from "../utils/ApiResponse.js";
import StockMovement from "../models/stockMovement.model.js";
import { StockMovementReferenceType, StockMovementType } from "../enums/stockMov.enums.js";
import createStockMovement from "../utils/stockMovement/stockMovement.util.js";


// create inventory handler
export const createInventory= AsyncHandler(async (req:Request, res:Response)=>{
    const {productId, warehouseId, quantity, reorderlevel}= req.body

    const validation= inventoryValidationSchema.safeParse(req.body)

    if (!validation.success) {
        const errors= formatZodErrors(validation.error);

        throw new ApiError(400, "validation failed", errors)
    }

    const alreadyExisits= await Inventory.findOne({
        $and:[
            {productId: productId},
            {warehouseId: warehouseId}
        ]
    })

    if (alreadyExisits) {
        throw new ApiError(400, "inventory already exists with this product and warehouse")
    }

    const newInventory= await Inventory.create({
        productId,
        warehouseId,
        quantity,
        reorderlevel,
        status: InventoryStatus.ACTIVE
    })

    if (!newInventory) {
        throw new ApiError(400, "error creating inventory")
    }

    return res.status(201).json(
        new ApiResponse(201, "inventory created successfully", newInventory)
    )
})

// get single inventory handler
export const getInventory= AsyncHandler(async (req:Request, res:Response)=>{
    const {inventoryId}= req.params;


    if (!inventoryId) {
        throw new ApiError(400, "inventory id not found")
    }

    const inventory= await Inventory.findById(inventoryId)
    .populate("productId")
    .populate("warehouseId")

    if (!inventory) {
       throw new ApiError(400, "inventory not found")   
    }

    if (inventory.status === InventoryStatus.INACTIVE) {
        throw new ApiError(400, "this inventory not active")
    }

    return res.status(200).json(
        new ApiResponse(200, "inventory found ", inventory)
    )
})


// get inventory for a specific warehouse handler 
export const inventoryOfWarehouse = AsyncHandler( async (req:Request, res:Response)=>{
    const {warehouseId} = req.params;

    if (!warehouseId) {
        throw new ApiError(400, "warehouse id not found")
    }    

    const warehouseInventory= await Inventory.find({warehouseId: warehouseId})
    
    if (warehouseInventory.length === 0) {
       throw new ApiError(404, "inventory not found for this warehouse")
    }

    return res.status(200).json(
        new ApiResponse(200, "inventory for this warehouse found ", warehouseInventory)
    )

})


// get inventory for specific product 
export const inventoryOfProduct = AsyncHandler( async (req:Request, res:Response)=>{
    const {productId} = req.params;

    if (!productId) {
        throw new ApiError(400, "product id not found")
    }    

    const productInventory= await Inventory.find({productId: productId})
    
    if (productInventory.length === 0) {
       throw new ApiError(404, "inventory not found for this product")
    }

    return res.status(200).json(
        new ApiResponse(200, "inventory for this product found ", productInventory)
    )

})


// update reorder level of inventory
export const updateReorderLevel= AsyncHandler( async (req:Request, res:Response)=>{
    const {inventoryId}= req.params;
    const {newReorderLevel}= req.body;

    if (!inventoryId || newReorderLevel === undefined) {
        throw new ApiError(400, "missing Inventory Id or reorder level")
    }

    if (newReorderLevel < 0) {
        throw new ApiError(400, "reorder level can't be less than 0")
    }

    const inv= await Inventory.findByIdAndUpdate(
        inventoryId,
        {
            $set:{
                reorderlevel: newReorderLevel
            }
        }, {new: true}
    )

    if (!inv) {
        throw new ApiError(404, "inventory not found")
    }

    return res.status(200).json(
        new ApiResponse(200, "reorder level updated!", inv)
    )

})


// update status handler
export const updateInventoryStatus= AsyncHandler( async (req:Request, res:Response)=>{

    const {inventoryId}= req.params;
    const {newStatus}= req.body;

    if (!inventoryId || !newStatus) {
        throw new ApiError(400, "missing inventory Id or status")
    }
    if (!Object.values(InventoryStatus).includes(newStatus)) {
       throw new ApiError(400, "invalid status type")   
    }

   const updated= await Inventory.findByIdAndUpdate(
        inventoryId,
        {
            $set:{
                status: newStatus
            }
        }, {new: true}
    )

    if (!updated) {
        throw new ApiError(404, "inventory not found")
    }

    return res.status(200).json(
        new ApiResponse(200, "status updated successfully!", updated)
    )
})


// adjust inventory handler
export const adjustInventory= AsyncHandler(async (req:Request, res:Response)=>{
    const {inventoryId}= req.params;
    const{quantity, type, reason}= req.body;

    if (!inventoryId) {
        throw new ApiError(400, "missing inventory ID")
    }

    const validation = adjustInventorySchema.safeParse(req.body)

    if (!validation.success) {
        const errors= formatZodErrors(validation.error)

        throw new ApiError(400, "validation failed", errors)
    }

    let updated= null;
    let quantityBefore=null;
    let quantityAfter=null;

    if (type === StockMovementType.IN) {
        updated = await Inventory.findByIdAndUpdate(
            inventoryId,
            {
                $inc:{
                    quantity: quantity
                }
            },{new: true}
    )
        if (updated) {
         quantityBefore= updated.quantity - quantity
         quantityAfter= updated?.quantity;
      }
    }else if (type === StockMovementType.OUT) {
        updated= await Inventory.findOneAndUpdate(
            {
                _id: inventoryId,
                quantity: {$gte: quantity}
            },
            {
                $inc:{
                    quantity: -quantity
                }
            },{new: true}
        )
        if (updated) {
            quantityBefore= updated.quantity +  quantity;
            quantityAfter= updated.quantity;
        }
    }else{
        throw new ApiError(400, "invalid adjust type")
    }

    if (!updated) {
        throw new ApiError(400, "insufficient quantity")
    }

    if(quantityAfter === null || quantityBefore === null) {
        throw new ApiError(400 ,"quantities are not calculated ")
    }

    const data={
        productId: updated.productId,
        type: type,
        movementQty: quantity,
        warehouseId: updated.warehouseId,
        quantityBefore: quantityBefore,
        quantityAfter: quantityAfter,
        performedBy: req.user?.id,
        reason: reason,
        referenceId: updated._id,
        referenceType: StockMovementReferenceType.ADJUSTMENT

    }

   let stockMovement= await createStockMovement(data)
   console.log("stock movement created! ",stockMovement);
   
    return res.status(200).json(
        new ApiResponse(200, "inventory adjusted successfully! ", updated)
    )

})