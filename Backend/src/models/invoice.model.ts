import mongoose from "mongoose";
import type { orderType } from "./order.model.js";

export interface IInvoice{
    _id?: mongoose.Types.ObjectId,
    orderId: mongoose.Types.ObjectId,
    customerName: string,
    customerPhone?: string,
    invoiceId: string,
    warehouseId: mongoose.Types.ObjectId,
    items: orderType[],
    subtotal: number,
    discount: number,
    total: number,
    issuedBy: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date
}

const invoiceSchema= new mongoose.Schema<IInvoice>({
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required: true
    },
    customerName:{
        type: String,
        required: true
    },
    customerPhone:{
        type: String,
    },
    warehouseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"WareHouse",
        required: true
    },
    invoiceId:{
        type: String,
        required: true,
        unique: true
    },
    items:[
            {
                productId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required: true
                },
                quantity:{
                    type: Number,
                    required: true
                },
                unitPrice:{
                    type: Number,
                    required: true
                },
                 subTotal:{
                    type: Number,
                    required: true
                },
                sku:{
                    type: String,
                    required: true
                }
            }
        ],
    issuedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    subtotal:{
        type: Number,
        required: true
    },
    discount:{
        type: Number,
        required: true
    },
    total:{
        type: Number,
        required: true
    }

},{timestamps: true})

invoiceSchema.index({
    warehouseId:1
})

const Invoice= mongoose.model("Invoice", invoiceSchema)
export default Invoice;