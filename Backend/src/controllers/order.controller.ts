import type { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { orderValidationSchema } from "../validations/order.validation.js";
import { formatZodErrors } from "../utils/zodErrors.js";
import ApiError from "../utils/ApiError.js";
import type mongoose from "mongoose";
import Inventory from "../models/inventory.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { generateOrderId } from "../utils/orderId.js";
import { OrderStatus } from "../enums/order.enum.js";
import { StockMovementReason, StockMovementReferenceType, StockMovementType } from "../enums/stockMov.enums.js";
import StockMovement from "../models/stockMovement.model.js";
import ApiResponse from "../utils/ApiResponse.js";


// create order handler
export const createOrder= AsyncHandler(async (req:Request, res:Response)=>{
    const {customerName, customerPhone, warehouseId, discount}= req.body;
    const {items}=req.body;

    if (items.length === 0) {
        throw new ApiError(400, "order items can't be empty")
    }

    const validation= orderValidationSchema.safeParse(req.body)

    if (!validation.success) {
        const errors= formatZodErrors(validation.error)

        throw new ApiError(400, "validation failed ", errors)
    }

    type item={
        productId: mongoose.Types.ObjectId,
        quantity: number
    }

    const productIDs= items.map((item: item)=> item.productId)
    if (!productIDs) {
        throw new ApiError(400, "product item IDs not found")
    }

    const products= await Product.find({
    _id: {$in: productIDs}
     })

    if (products.length === 0) {
    throw new ApiError(400, "products not found")
    }

    const inventories= await Inventory.find({
        warehouseId,
        productId: {$in: productIDs}
    })

    if (inventories.length === 0) {
        throw new ApiError(400, "invalid product IDs")
    }
    
    const inventoryMap = new Map(
    inventories.map(inv => [
        inv.productId.toString(),
        inv.quantity
    ])
   );

   for (const item of items) {

    const availableQty= inventoryMap.get(item.productId)

    if (availableQty === undefined) {
        throw new ApiError(400, `quantity not found for this product ${item.productId}`)
    }

    if (availableQty < item.quantity) {
        throw new ApiError(400, `insufficient quantity for this product ${item.productId}`)
    }
   }

   const productMap = new Map(
    products.map(product => [
        product._id.toString(),
        product
    ])
   );

   const Orders= items.map((item: item) =>{

    const prod= productMap.get(item.productId.toString())

    const unitPrice= prod?.sellPrice;
    if (!unitPrice) {
        throw new ApiError(400, "sell price not found for this product")
    }

     return{
        productId: prod?._id,
        quantity: item.quantity,
        sku: prod?.sku,
        unitPrice,
        subTotal: unitPrice * item.quantity
     }
   })

    const operations = items.map((item: item) => ({
     updateOne: {
         filter: {
             warehouseId,
             productId: item.productId,
             quantity: { $gte: item.quantity }
         },
         update: {
            $inc: {
                quantity: -item.quantity
              }
          }
      }
  }));

  await Inventory.bulkWrite(operations)

   const orderId= generateOrderId();
   const subtotal= Orders.reduce((acc, ord)=>  acc + ord.subTotal ,0)
   const Discount= subtotal * (discount / 100)
   const total= subtotal - Discount;

   const newOrder= await Order.create({
    orderId: orderId,
    customerName,
    customerPhone,
    orderItems:Orders,
    warehouseId,
    salesManager: req.user.id,
    subtotal: subtotal,
    discount: Discount,
    total: total,
    status: OrderStatus.PENDING

   })

   if (!newOrder) {
    throw new ApiError(400, "error while creating order")
   }

   const movements= items.map((item: item)=>{

    const quantityBefore= inventoryMap.get(item.productId.toString())
    if (!quantityBefore) {
        throw new ApiError(400, "error while creating stock movements data")
    }
    const quantityAfter= quantityBefore - item.quantity;

    return{
        productId: item.productId,
        type: StockMovementType.OUT,
        movementQty: item.quantity,
        quantityBefore,
        quantityAfter,
        performedBy: req.user.id,
        reason: StockMovementReason.SALE,
        referenceId: newOrder._id,
        referenceType: StockMovementReferenceType.ORDER

    }
})
     await StockMovement.insertMany(movements)

    return res.status(201).json(
        new ApiResponse(200, "order created successfully ", newOrder)
    )

})


// find order by warehouse 
export const getWareHouseOrders= AsyncHandler(async (req:Request, res:Response)=>{
    const {warehouseId}= req.params;

    if (!warehouseId) {
        throw new ApiError(400, "warehouse Id not found")
    }

    const orders= await Order.find({warehouseId})

    if (orders.length === 0) {
        throw new ApiError(404, "no orders found for this warehouse")
    }

    return res.status(200).json(
        new ApiResponse(200, "orders for warehouse found", orders)
    )

})


// find order by product
export const getProductOrders= AsyncHandler(async (req:Request, res:Response)=>{
    const {productId}= req.params;

    if (!productId) {
        throw new ApiError(400, "product Id not found")
    }

    const orders= await Order.find({productId})

    if (orders.length === 0) {
        throw new ApiError(404, "no orders found for this product")
    }

    return res.status(200).json(
        new ApiResponse(200, "orders for product found", orders)
    )

})

// cancel order
export const cancelOrder= AsyncHandler(async (req:Request, res:Response)=>{
    const {orderId}= req.params;

    if (!orderId) {
        throw new ApiError(400, "order id not found")
    }

   const cancelledOrder= await Order.findByIdAndUpdate(
        orderId,
        {
            $set:{
                status: OrderStatus.CANCELLED
            }
        },{new: true}
    )

    return res.status(200).json(
        new ApiResponse(200, "order cancelled successfully", cancelOrder)
    )
})
