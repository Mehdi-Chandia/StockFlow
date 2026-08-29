import mongoose, { mongo, trusted } from 'mongoose'
import { OrderStatus } from '../enums/order.enum.js'

export type orderType={
    productId: mongoose.Types.ObjectId,
    quantity: number,
    unitPrice: number,
    subTotal: number,
    sku: string
}

interface IOrder{
    _id?: mongoose.Types.ObjectId,
    orderId: string,
    customerName: string,
    customerPhone?: string,
    orderItems:orderType[],
    warehouseId: mongoose.Types.ObjectId,
    salesManager: mongoose.Types.ObjectId,
    subtotal: number,
    discount: number,
    status:OrderStatus,
    total: number,
    createdAt?: Date,
    updatedAt?: Date
}

const orderSchema= new mongoose.Schema<IOrder>({
    orderId:{
        type: String,
        required: true,
        unique: true
    },
    customerName:{
        type: String,
        required: true,
    },    
    customerPhone:{
        type: String,
    },
    warehouseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WareHouse",
        required: true
    },
    orderItems:[
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
    status:{
        type: String,
        enum: Object.values(OrderStatus),
        required: true
    },
    salesManager:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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
    },    
},{timestamps: true})

orderSchema.index({
    warehouseId: 1
})

const Order= mongoose.model<IOrder>("Order", orderSchema)
export default Order;