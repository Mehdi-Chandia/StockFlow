import mongoose from "mongoose";
import { ProductStatus } from "../enums/product.enum.js";


interface IProductImage{
    url: string,
    publicId: string
}

interface IProduct{
    _id?: mongoose.Types.ObjectId,
    name: string,
    category: string,
    sku: string,
    purchasePrice: number,
    sellPrice: number,
    minQty: number,
    maxQty: number,
    image: IProductImage,
    description?: string,
    brand: string,
    status: ProductStatus,
    createdBy: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date

}

const productSchema=new mongoose.Schema<IProduct>({
    name:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    sku:{
        type: String,
        required: true,
        unique: true
    },
    purchasePrice:{
        type: Number,
        required: true
    },
    sellPrice:{
        type: Number,
        required: true
    },
    minQty:{
        type: Number,
        required: true
    },
    maxQty:{
        type: Number,
        required: true
    },
    image: {
        url: {
         type: String,
         required: true
       },
        publicId: {
         type: String,
         required: true
       }
    },
    description:{
        type: String,
    },
    brand:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: Object.values(ProductStatus),
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    }
}, {timestamps: true})

const Product= mongoose.model<IProduct>("Product", productSchema)
export default Product;