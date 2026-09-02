import type { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { shipmentValidationSchema } from "../validations/shipment.validation.js";
import { formatZodErrors } from "../utils/formatZodErrors.js";
import ApiError from "../utils/ApiError.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import { PurchaseOrderStatus } from "../enums/purchaseOrder.enum.js";
import mongoose from "mongoose";
import Shipment from "../models/shipment.model.js";
import { generateShipmentNumber } from "../utils/generateShipmentNum.js";
import Inventory from "../models/inventory.model.js";
import { InventoryStatus } from "../enums/inventory.enum.js";
import { StockMovementReason, StockMovementReferenceType, StockMovementType } from "../enums/stockMov.enums.js";
import StockMovement from "../models/stockMovement.model.js";
import { AuditAction, AuditEntityType } from "../enums/auditLog.enum.js";
import { createAuditLog } from "../utils/auditLog/createAuditLog.js";
import ApiResponse from "../utils/ApiResponse.js";
import { pagination } from "../utils/pagination.js";

/*
create shipment
1. get the data from body validate it with zod
2. now find the PO and validate its status and match the quantities of each prod if it is valid  
and calc the expecting received damaged and missing Qty 
3. create shipment 
4. find inventory for those prods and with the given warehouse then map the inv with the prodIds then check if the inv for those products 
exist using invMap if it exists add it to updateOpr otherwise add to newInvOpr
5. if no inventory found create a new one if found update it
6. update the status of PO
7. create stock mov
8. create audit log

*/

//create receive shipment doc
export const receiveShipment= AsyncHandler(async (req: Request, res: Response)=>{
    // create the mongoDB transaction session 
    const session= await mongoose.startSession();
try {
        const {purchaseOrderId, items, receivedAt}= req.body;
    
        const validation= shipmentValidationSchema.safeParse(req.body);
        if (!validation.success) {
            const errors= formatZodErrors(validation.error)
    
            throw new ApiError(400, "validation failed ", errors)
        }
        
        // start transaction
        session.startTransaction();

        // find the purchase order with the ID coming of it from shipment
        const PO= await PurchaseOrder.findById(purchaseOrderId).session(session);
        if (!PO) {
            throw new ApiError(400, "invalid PO Id")
        }
    
        // check the status of PO if it is already received or cancelled
        if (PO.status === PurchaseOrderStatus.CANCELLED || PO.status === PurchaseOrderStatus.RECEIVED) {
            throw new ApiError(400, "this purchase order is already received or cancelled")
        }

        const warehouseId = PO.warehouseId
        const supplierId = PO.supplierId
    
        // map the quantity of items with their product ID
        const purchaseOrderMap= new Map(
            PO.items.map((item)=>[
                item.productId.toString(),
                item.quantity
            ]as [string, number])
        )
    
        type itemType={
            productId: mongoose.Types.ObjectId,
            receivedQty: number,
            damagedQty: number,
            note: string
        }
    
        // validate the quantities of items to assure it is correct and valid
        const shipmentItems= items.map((item: itemType)=>{
            const expectedQty= purchaseOrderMap.get(item.productId.toString())
            if (!expectedQty) {
                throw new ApiError(400, "expected Qty for PO not found")
            }
            if (item.receivedQty > expectedQty) {
                throw new ApiError(400, "received Qty cannot be greater than expected Qty")
            }
    
            if (item.damagedQty > item.receivedQty) {
               throw new ApiError(400,"damaged quantity cannot be greater than received quantity");
            }
            const missingQty= expectedQty - item.receivedQty;
            const usableQty= item.receivedQty - item.damagedQty;
    
            return{
                productId: item.productId,
                receivedQty: item.receivedQty,
                expectedQty,
                missingQty,
                usableQty,
                damagedQty: item.damagedQty,
                note: item.note
            }
        })
    
        const shipmentNumber= generateShipmentNumber();
    
        const createShipment= await Shipment.create([{
            shipmentNumber,
            purchaseOrderId,
            warehouseId,
            supplierId,
            items: shipmentItems,
            receivedBy: req.user.id,
            receivedAt,
        }], {session})

       
        const newShipment=createShipment[0];
        if (!newShipment) {
        throw new ApiError(400, "error while creating shipment document");
        }

    
        // extract the IDs of products from items array
        const prodIDs= items.map((item: itemType)=> item.productId)

        // find the inventories of those products
        const inventories= await Inventory.find({
            warehouseId,
            productId: {$in: prodIDs}
        })
    
        // map the whole inventory with the product ID
        const inventoryMap= new Map(
            inventories.map((inv)=>[
                inv.productId.toString(),
                inv
            ])
        )
    
        const updateOperations=[];
        const newInventories=[];
    
        // now check the inventories of product by matching their ID with the inventory map 
        // it matches add it to update opr otherwise add it to new inventory opr
        for (const item of items) {
            const existingInventory= inventoryMap.get(item.productId.toString())
            const usableQty = item.receivedQty - item.damagedQty;
    
            if (existingInventory) {
                updateOperations.push({
                    updateOne: {
                        filter:{
                            warehouseId,
                            productId: item.productId
                        },
                        update:{
                            $inc:{
                                quantity: usableQty
                            }
                        }
                    }
            })
            }else{
                newInventories.push({
                    warehouseId,
                    productId: item.productId,
                    quantity: usableQty,
                    reorderlevel: 10,
                    status: InventoryStatus.ACTIVE
    
            })
            }
        }
    
        if (updateOperations.length > 0) {
            // update the existing inventories 
            await Inventory.bulkWrite(updateOperations, {session});
        }
        if (newInventories.length > 0) {
            // create new inventories for those products whose shipment has been received
            await Inventory.insertMany(newInventories, {session})
        }
    
        // setup movements data 
        const movements= items.map((item:itemType)=>{
            const inv = inventoryMap.get(item.productId.toString())
            if (inv === undefined) {
                return{
                productId: item.productId,
                type: StockMovementType.IN,
                quantityBefore: 0,
                quantityAfter: item.receivedQty - item.damagedQty,
                movementQty: item.receivedQty - item.damagedQty,
                warehouseId,
                performedBy: req.user.id,
                reason:StockMovementReason.PURCHASE,
                referenceId: newShipment._id,
                referenceType: StockMovementReferenceType.PURCHASE
                }
            }
            const quantityBefore= inv.quantity;
    
            const quantityAfter= quantityBefore + (item.receivedQty - item.damagedQty);
    
            return{
                productId: item.productId,
                type: StockMovementType.IN,
                quantityBefore,
                quantityAfter,
                movementQty: item.receivedQty - item.damagedQty,
                warehouseId,
                performedBy: req.user.id,
                reason:StockMovementReason.PURCHASE,
                referenceId: newShipment._id,
                referenceType: StockMovementReferenceType.PURCHASE
            }
           
        })
    
        // create movement
        await StockMovement.insertMany(movements, {session});
    
        // setup auditLog data
        const auditLogData={
                action: AuditAction.CREATE,
                entityType: AuditEntityType.SHIPMENT,
                entityId: newShipment._id,
                performedBy: req.user.id,
                reason: "received a shipment"
        }
    
        // create auditLog
        await createAuditLog(auditLogData, session);
    
        // update the status of Purchase order at the end 
        PO.status= PurchaseOrderStatus.RECEIVED;
        await PO.save({session});

        // if everything succeed commit the transaction and send res
        await session.commitTransaction();
    
        return res.status(201).json(
            new ApiResponse(201, "shipement received successfully", newShipment)
        )
} catch (error) {
    // in case of any error rollback everything
    await session.abortTransaction();
   throw error; 
}finally{
    // finally end the transaction session
    session.endSession();
}

})

// get shipment by ID
export const getShipment= AsyncHandler(async (req:Request, res: Response)=>{
    const {shipmentId}= req.params;

    if (!shipmentId) {
        throw new ApiError(400, "shipment ID not found")
    }

    const shipment= await Shipment.findById(shipmentId)

    if (!shipment) {
        throw new ApiError(400, "invalid shipment ID")
    }

    return res.status(200).json(
        new ApiResponse(200, "shipment found", shipment)
    )
})

// get shipment with pagination and filtering
export const getShipments= AsyncHandler(async (req: Request, res: Response)=>{
    const {warehouseId, purchaseOrderId, productId, supplierId}= req.query;

    const{page, limit, skip} = pagination({
        Page: req.query.page?.toString(),
         Limit: req.query.limit?.toString()
        })

    if ((
        warehouseId && !mongoose.isValidObjectId(warehouseId) ||
         purchaseOrderId && !mongoose.isValidObjectId(purchaseOrderId) || 
         productId && !mongoose.isValidObjectId(productId) || 
         supplierId && !mongoose.isValidObjectId(supplierId)
        )) {
        throw new ApiError(400, "invalid IDs provided")
    }    

    const filter:any={}    

    if (warehouseId) {
        filter.warehouseId = warehouseId;
    }

    if (purchaseOrderId) {
        filter.purchaseOrderId = purchaseOrderId;
    }

    if (productId) {
        filter["items.productId"] = productId;
    }

    if (supplierId) {
        filter.supplierId = supplierId; 
    }

    const shipments= await Shipment.find(filter)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)

    if (shipments.length === 0) {
        throw new ApiError(404, "no shipments found")
    }
    
    const totalRecords= await Shipment.countDocuments(filter)
    const totalPages= Math.ceil(totalRecords / limit);
    const hasNextPage= page < totalPages;
    const hasPrevPage= page > 1;

    const data={
        shipments,
        pagination: {
            totalRecords,
            totalPages,
            hasNextPage,
            hasPrevPage,
            currentPage: page,
            limit
        }
    }

    return res.status(200).json(
        new ApiResponse(200, "shipments found", data)
    )

})