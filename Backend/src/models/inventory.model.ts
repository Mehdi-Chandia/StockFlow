import mongoose from "mongoose";
import { InventoryStatus } from "../enums/inventory.enum.js";

interface IInventory{
    _id?: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId,
    warehouseId: mongoose.Types.ObjectId,
    quantity: number,
    reorderlevel: number,
    status: InventoryStatus,
    createdAt: Date,
    updatedAt: Date
}

const inventorySchema= new mongoose.Schema<IInventory>({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    warehouseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WareHouse",
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    reorderlevel:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: Object.values(InventoryStatus),
        required: true
    }

},{timestamps: true})

inventorySchema.index(
    {productId: 1, warehouseId: 1},
    {unique: true}
)


const Inventory= mongoose.model<IInventory>("Inventory", inventorySchema)
export default Inventory;