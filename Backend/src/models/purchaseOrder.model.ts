import mongoose from "mongoose";
import { PurchaseOrderStatus } from "../enums/purchaseOrder.enum.js";

export type itemType={
    productId: mongoose.Types.ObjectId,
    quantity: number
}

interface IPurchaseOrder{
    _id?: mongoose.Types.ObjectId,
    poId: string,
    warehouseId: mongoose.Types.ObjectId,
    supplierId: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    items: itemType[],
    expectedAt: Date,
    status: PurchaseOrderStatus,
    createdAt?: Date,
    updatedAt?: Date
}

const purchaseOrderSchema= new mongoose.Schema<IPurchaseOrder>({
    poId:{
        type: String,
        required: true,
        unique: true
    },
    warehouseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WareHouse",
        required: true
    },
     supplierId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items:[
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity:{
                type: Number,
                required: true
            }
        }
    ],
    expectedAt:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: Object.values(PurchaseOrderStatus),
        required: true
    }
})

purchaseOrderSchema.index({
    warehouseId: 1, supplier: 1
})

const PurchaseOrder= mongoose.model<IPurchaseOrder>("PurchaseOrder", purchaseOrderSchema)
export default PurchaseOrder;