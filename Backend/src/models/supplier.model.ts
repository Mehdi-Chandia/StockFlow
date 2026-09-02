import mongoose from "mongoose";
import { SupplierCategory, SupplierStatus } from "../enums/supplier.enum.js";

export interface ISupplier{
    _id?: mongoose.Types.ObjectId,
    name: string,
    email: string,
    address: string,
    phone: string,
    city: string,
    companyName: string,
    categories: SupplierCategory[],
    status: SupplierStatus,
    createdBy: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date
}

const supplierSchema= new mongoose.Schema<ISupplier>({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    companyName:{
        type: String,
        required: true
    },
    categories:{
        type: [String],
        enum: Object.values(SupplierCategory),
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: Object.values(SupplierStatus),
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

},{timestamps: true})

supplierSchema.index({ companyName: 1, city: 1, categories: 1 });


const Supplier= mongoose.model<ISupplier>("Supplier", supplierSchema)
export default Supplier;