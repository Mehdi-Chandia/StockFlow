import type { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { orderValidationSchema } from "../validations/order.validation.js";
import { formatZodErrors } from "../utils/formatZodErrors.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import Inventory from "../models/inventory.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { generateOrderId } from "../utils/orderId.js";
import { OrderStatus } from "../enums/order.enum.js";
import {
  StockMovementReason,
  StockMovementReferenceType,
  StockMovementType,
} from "../enums/stockMov.enums.js";
import StockMovement from "../models/stockMovement.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { pagination } from "../utils/pagination.js";
import createInvoice from "../utils/invoice/createInvoice.js";
import type { IInvoice } from "../models/invoice.model.js";
import { generateInvoiceId } from "../utils/generateInvoiceId.js";
import { AuditAction, AuditEntityType } from "../enums/auditLog.enum.js";
import { createAuditLog } from "../utils/auditLog/createAuditLog.js";


// create order handler
export const createOrder = AsyncHandler(async (req: Request, res: Response) => {

  // create a session for transaction
  const session = await mongoose.startSession();
  try {
    const { customerName, customerPhone, warehouseId, discount } = req.body;
    const { items } = req.body;
    // console.log("data received ", req.body);
    

    if (items.length === 0) {
      throw new ApiError(400, "order items can't be empty");
    }

    const validation = orderValidationSchema.safeParse(req.body);

    if (!validation.success) {
      const errors = formatZodErrors(validation.error);

      throw new ApiError(400, "validation failed ", errors);
    }
    

    type item = {
      productId: mongoose.Types.ObjectId;
      quantity: number;
    };

    // extract the IDs of products
    const productIDs = items.map((item: item) => item.productId);
    if (!productIDs) {
      throw new ApiError(400, "product item IDs not found");
    }

    // start the transaction
    session.startTransaction();

    const products = await Product.find({
      _id: { $in: productIDs },
    });

    if (products.length === 0) {
      throw new ApiError(400, "products not found");
    }

    // find inventories for those products with the IDs we just extracted from items
    const inventories = await Inventory.find({
      warehouseId,
      productId: { $in: productIDs },
    });

    if (inventories.length === 0) {
      throw new ApiError(400, "invalid product IDs");
    }

    // create a map of each product ID with its available quantity 
    const inventoryMap = new Map(
      inventories.map((inv) => [
        inv.productId.toString(), 
        inv.quantity
     ]),
    );

    // match the quantity of items coming from body with the actual available quantity we have in inventory
    for (const item of items) {
      const availableQty = inventoryMap.get(item.productId.toString());

      if (availableQty === undefined) {
        throw new ApiError(
          400,
          `quantity not found for this product ${item.productId}`,
        );
      }

      if (availableQty < item.quantity) {
        throw new ApiError(
          400,
          `insufficient quantity for this product ${item.productId}`,
        );
      }
    }

    const productMap = new Map(
      products.map((product) => [product._id.toString(), product]),
    );

    // add the details of each product 
    const Orders = items.map((item: item) => {
      const prod = productMap.get(item.productId.toString());

      const unitPrice = prod?.sellPrice;
      if (unitPrice === undefined) {
        throw new ApiError(400, "sell price not found for this product");
      }

      return {
        productId: prod?._id,
        quantity: item.quantity,
        sku: prod?.sku,
        unitPrice,
        subTotal: unitPrice * item.quantity,
      };
    });

    // operations to update/decrement the inventory of those particular products 
    const operations = items.map((item: item) => ({
      updateOne: {
        filter: {
          warehouseId,
          productId: item.productId,
          quantity: { $gte: item.quantity },
        },
        update: {
          $inc: {
            quantity: -item.quantity,
          },
        },
      },
    }));

    // update the inventory of all the products in one query - add session inside db calls to make the query part of transaction
    await Inventory.bulkWrite(operations, { session });

    const orderId = generateOrderId();
    const subtotal = Orders.reduce((acc, ord) => acc + ord.subTotal, 0);
    const Discount = subtotal * (discount / 100);
    const total = subtotal - Discount;

    const createdOrders = await Order.create(
      [
        {
          orderId: orderId,
          customerName,
          customerPhone,
          orderItems: Orders,
          warehouseId,
          salesManager: req.user.id,
          subtotal: subtotal,
          discount: Discount,
          total: total,
          status: OrderStatus.PENDING,
        },
      ],
      { session },
    );

    const newOrder = createdOrders[0];

    if (!newOrder) {
      throw new ApiError(400, "error while creating order");
    }

    // stock movements we will add invidual movements not all in one 
    const movements = items.map((item: item) => {
      const quantityBefore = inventoryMap.get(item.productId.toString());
      if (quantityBefore === undefined) {
        throw new ApiError(400, "error while creating stock movements data");
      }
      const quantityAfter = quantityBefore - item.quantity;

      return {
        productId: item.productId,
        type: StockMovementType.OUT,
        movementQty: item.quantity,
        quantityBefore,
        quantityAfter,
        performedBy: req.user.id,
        reason: StockMovementReason.SALE,
        referenceId: newOrder._id,
        referenceType: StockMovementReferenceType.ORDER,
      };
    });

    // insert all the movements 
    await StockMovement.insertMany(movements, { session });

    const invoiceId= generateInvoiceId()

    // data to create invoice and save it into db 
    const data:IInvoice={
      orderId: newOrder._id,
      invoiceId,
      warehouseId,
      items: Orders,
      customerName,
      customerPhone,
      subtotal,
      discount: Discount,
      total,
      issuedBy: req.user.id
    }

    // create invoice
    await createInvoice(data, session)

    // data to create audit logs
    const auditLogData={
      action: AuditAction.CREATE,
      entityType: AuditEntityType.ORDER,
      entityId: newOrder._id,
      performedBy: req.user.id,
      reason: "created a new order"
    }

    // create audit log
    await createAuditLog(auditLogData, session)

    // successfully commit the transaction
    await session.commitTransaction();

    return res
      .status(201)
      .json(new ApiResponse(200, "order created successfully ", newOrder));

  } catch (error) {
    // abort the transaction in case of any error 
    await session.abortTransaction();
    throw error;

  } finally {

    // finally end session
    await session.endSession();
  }
});

// find order by warehouse
export const getWareHouseOrders = AsyncHandler(
  async (req: Request, res: Response) => {
    const { warehouseId } = req.params;

    if (!warehouseId) {
      throw new ApiError(400, "warehouse Id not found");
    }

    const orders = await Order.find({ warehouseId });

    if (orders.length === 0) {
      throw new ApiError(404, "no orders found for this warehouse");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "orders for warehouse found", orders));
  },
);

// find order by product
export const getProductOrders = AsyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;

    if (!productId) {
      throw new ApiError(400, "product Id not found");
    }

    const orders = await Order.find({ 
    "orderItems.productId": productId
     });

    if (orders.length === 0) {
      throw new ApiError(404, "no orders found for this product");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "orders for product found", orders));
  },
);

// cancel order
export const cancelOrder = AsyncHandler(async (req: Request, res: Response) => {

  const session= await mongoose.startSession()
 try {
   const { orderId } = req.params;
 
   if (!orderId) {
     throw new ApiError(400, "order id not found");
   }
 
   session.startTransaction()

  //  find the order with the given id
   const order= await Order.findById(orderId).session(session)
   if (!order) {
     throw new ApiError(400, "invaid order ID")
   }
 
  //  check the status of the order what if its already delivered or cancelled
   if (order.status !== OrderStatus.PENDING) {
     throw new ApiError(400, "this order is already delivered or cancelled")
   }
 
  //  extract the productIDs from the order items
   const productIDs= order.orderItems.map(item=> item.productId)
   if (productIDs.length === 0) {
     throw new ApiError(400, "product IDs not found inside order items")
   }
 
  //  find inventory of those products of that particular warehouse
   const inventories= await Inventory.find({
     warehouseId:order.warehouseId,
     productId: {$in: productIDs}
 
   }).session(session)
 
   if (inventories.length === 0) {
     throw new ApiError(400, "inventory not found for these products")
   }
 
   const inventoryMap= new Map(
     inventories.map((inv)=>[
       inv.productId.toString(),
       inv.quantity
     ])
   )
 
  //  define operations to update inventory of those products
   const operations= order.orderItems.map((item)=> ({
     updateOne:{
       filter:{
         warehouseId: order.warehouseId,
         productId: item.productId
       },
       update:{
         $inc:{
           quantity: item.quantity
         }
       }
     }
   }))


  //  bulk write runs the queries we defined in operations
   await Inventory.bulkWrite(operations,{session})

  //  create stock movements - individual movement for each product
      const movements= order.orderItems.map((item)=>{
 
     const quantityBefore=inventoryMap.get(item.productId.toString())
     if (quantityBefore === undefined) {
       throw new ApiError(400, "quantity before is undefined")
     }
     const quantityAfter= quantityBefore + item.quantity
 
     return{
       productId: item.productId,
       type: StockMovementType.IN,
       movementQty: item.quantity,
       warehouseId: order.warehouseId,
       quantityBefore,
       quantityAfter,
       performedBy: req.user?.id,
       reason: StockMovementReason.RETURN,
       referenceId: order._id,
       referenceType: StockMovementReferenceType.RETURN
     }
   })
 
   await StockMovement.insertMany(movements, {session})
 
   const cancelledOrder = await Order.findByIdAndUpdate(
     orderId,
     {
       $set: {
         status: OrderStatus.CANCELLED,
       },
     },
     { 
      new: true,
       session 
      },
  );

  if (!cancelledOrder) {
    throw new ApiError(400, "error while cancelling the order");
  }


  const auditLogData={
    action: AuditAction.CANCEL,
    entityType: AuditEntityType.ORDER,
    entityId: cancelledOrder._id,
    performedBy: req.user.id,
    reason: "cancelled the order"
  }

  await createAuditLog(auditLogData, session)
 
  // if everything succeed commit the transaction
  await session.commitTransaction();
 
   return res
     .status(200)
     .json(new ApiResponse(200, "order cancelled successfully", cancelledOrder));
 } catch (error) {

  await session.abortTransaction()
  throw error;

 }finally{
  await session.endSession();
 }
});

// update order status
export const updateOrderStatus = AsyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if(!orderId || !status){
    throw new ApiError(400, "order id or status not found")
  }

  if(!Object.values(OrderStatus).includes(status)){
    throw new ApiError(400, "invalid status type")
  }

    const updatedOrder= await Order.findByIdAndUpdate(
        orderId,
        {
            $set:{
                status: status
            }
    }, {new: true})

    if (!updatedOrder) {
      throw new ApiError(404, "order not found")
    }

    const auditLogData = {
      action: AuditAction.UPDATE,
      entityType: AuditEntityType.ORDER,
      entityId: updatedOrder._id,
      performedBy: req.user.id,
      reason: `updated order status to ${status}`
    }
    await createAuditLog(auditLogData);

    return res.status(200).json(
        new ApiResponse(200, "order status updated successfully", updatedOrder)
    )

})

// get single order
export const getOrder= AsyncHandler(async (req:Request, res:Response)=>{
  const {orderId}= req.params;

  if (!orderId) {
    throw new ApiError(400, "order ID not found")
  }

  const order= await Order.findById(orderId)

  if (!order) {
    throw new ApiError(400, "invalid order ID")
  }

  return res.status(200).json(
    new ApiResponse(200, "order found ", order)
  )
})

// get all the orders with pagination and filtering
export const getOrders= AsyncHandler(async (req:Request, res:Response)=>{
  const{warehouseId, status, customerPhone, salesManager}= req.query;
  const {page, limit, skip}=  
     pagination({Page:req.query.page?.toString(),
     Limit:req.query.limit?.toString()})

  if ((warehouseId && !mongoose.isValidObjectId(warehouseId)) || (salesManager && !mongoose.isValidObjectId(salesManager))) {
    throw new ApiError(400, "invalid IDs")
  }

  if (status && !Object.values(OrderStatus).includes(status as OrderStatus)) {
     throw new ApiError(400, "invalid order status ")
  }

  const filter:any ={}

  if (warehouseId) {
    filter.warehouseId= warehouseId
  }
  if (salesManager) {
    filter.salesManager= salesManager
  }
  if (status) {
    filter.status= status
  }
  if (customerPhone) {
    filter.customerPhone= customerPhone
  }

  const orders= await Order.find(filter)
  .sort({createdAt: -1})
  .skip(skip)
  .limit(limit)

  if (orders.length === 0) {
    throw new ApiError(400, "no orders found with given data")
  }

  const totalRecords= await Order.countDocuments(filter)
  const totalPages= Math.ceil(totalRecords/limit);
  const hasNextPage= page < totalPages;
  const hasPrevPage= page > 1;

  const data={
    orders,
    totalRecords,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage
  }

  return res.status(200).json(
    new ApiResponse(200, "orders found", data)
  )

})