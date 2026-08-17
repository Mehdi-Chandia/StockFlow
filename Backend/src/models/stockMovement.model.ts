import mongoose from "mongoose";
import { StockMovementReason, StockMovementRefrenceType, StockMovementType } from "../enums/stockMov.enums.js";

export interface IStockMovement{
    _id?: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId,
    type: StockMovementType
    movementQty: number,
    warehouseId?: mongoose.Types.ObjectId,
    fromWareHouseId?: mongoose.Types.ObjectId,
    toWareHouseId?: mongoose.Types.ObjectId,
    quantityBefore: number,
    quantityAfter: number,
    performedBy: mongoose.Types.ObjectId,
    reason: StockMovementReason,
    refrenceType?: StockMovementRefrenceType,
    referenceId?: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date

}

const stockMovementSchema= new mongoose.Schema<IStockMovement>({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    type:{
        type: String,
        enum: Object.values(StockMovementType),
        required: true
    },
    reason:{
        type: String,
        enum: Object.values(StockMovementReason),
        required: true
    },
    warehouseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WareHouse"
    },
    fromWareHouseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WareHouse"
    },
    toWareHouseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WareHouse"
    },
    movementQty:{
        type: Number,
        required: true
    },
    quantityBefore:{
        type: Number,
        required: true
    },
    quantityAfter:{
        type: Number,
        required: true
    },
    performedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    referenceId:{
        type: mongoose.Schema.Types.ObjectId
    },
    refrenceType:{
        type: String,
        enum: Object.values(StockMovementRefrenceType),

    },

})


const StockMovement= mongoose.model("StockMovement", stockMovementSchema)
export default StockMovement;