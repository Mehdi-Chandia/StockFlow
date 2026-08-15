import type { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { productValidationSchema, updateProductValidationSchema } from "../validations/product.validaton.js";
import ApiError from "../utils/ApiError.js";
import { formatZodErrors } from "../utils/zodErrors.js";
import { UploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { generateProductSku } from "../utils/generateSKU.js";
import Product from "../models/product.model.js";
import { ProductStatus } from "../enums/product.enum.js";
import ApiResponse from "../utils/ApiResponse.js";


// create product handler

export const createProduct= AsyncHandler( async (req:Request, res:Response)=>{

    const {name, description, brand, category,
           purchasePrice, sellPrice, minQty, maxQty} = req.body;

    const adminId= req.user.id;     

         const validation= productValidationSchema.safeParse(req.body)
         if (!validation.success) {
            const errors= formatZodErrors(validation.error)
            throw new ApiError(400, "validation error",errors)
         }

    const file= req.file
    console.log("file from multer ",file);
    
    if (!file) {
        throw new ApiError(400, "image not provided")
    }

    const cloudinaryRes= await UploadToCloudinary(file.path)
    if (!cloudinaryRes) {
        
        throw new ApiError(500, "failed to upload to cloudinary")
    }

    const prefix= generateProductSku(category)
    const count= await Product.countDocuments({
        sku: { $regex: `^${prefix}-` }
    })

   const sku = `${prefix}-${String(count + 1).padStart(3, "0")}`;

    const alreadyExists= await Product.findOne({sku})

    if (alreadyExists) {
        throw new ApiError(400, "product already exixsts with the same sku")
    }

    const newProduct= await Product.create({
        name,
        category,
        description,
        sku,
        purchasePrice,
        sellPrice,
        status: ProductStatus.ACTIVE,
        brand,
        minQty,
        maxQty,
        createdBy:adminId,
        image:{
            url: cloudinaryRes.secure_url,
            publicId: cloudinaryRes.public_id
        }

    })

    if (!newProduct) {
        throw new ApiError(400, "product creation failed")
    }

    return res.status(201).json(
        new ApiResponse(201, "Product created successfully", newProduct)
    )
})

// get all products

export const listProducts= AsyncHandler( async (req:Request, res:Response)=>{

    const products= await Product.find();

    if (!products) {
        throw new ApiError(404, "no products found")
    }

    return res.status(200).json(
        new ApiResponse(200, "products found", products)
    )

})

// get single product

export const getProduct= AsyncHandler( async (req:Request, res:Response)=>{
    const {productId} = req.params;
    if (!productId) {
        throw new ApiError(400, "product ID not found")
    }

    const product= await Product.findById(productId)

    if (!product) {
        throw new ApiError(404, "product not found")
    }

    return res.status(200).json(
        new ApiResponse(200, "product found", product)
    )
})


// update Status

export const updateProductStatus= AsyncHandler( async (req:Request, res:Response)=>{
    const {status} = req.body;
    const {productId}= req.params;

    if (!productId) {
        throw new ApiError(400, "product Id not provided")
    }
    
    if (!status) {
        throw new ApiError(400, "status not provided")
    }

    if (!Object.values(ProductStatus).includes(status)) {
        throw new ApiError(400, "invalid status type")
    }

   const product= await Product.findByIdAndUpdate(
        productId,
        {
            $set:{
                status: status
            }
        }, 
        {new: true}
    )

    if (!product) {
        throw new ApiError(400, "product status updation failed")
    }

    return res.status(200).json(
        new ApiResponse(200, "status updated successfully", null)
    )


})


// update product

export const updateProduct= AsyncHandler(async (req:Request, res:Response)=>{
    const {productId}= req.params
    if (!productId) {
    throw new ApiError(400, "product ID not provided");
    }

    const validation= updateProductValidationSchema.safeParse(req.body)
    if (!validation.success) {
        const errors= formatZodErrors(validation.error)

        throw new ApiError(400, "validation error ", errors)
    }

   const updatedProduct= await Product.findByIdAndUpdate(
        productId,
        {
            $set: validation.data
        },
        {new: true}
    )

    if (!updatedProduct) {
        throw new ApiError(404, "no product found")
    }

    return res.status(200).json(
        new ApiResponse(200, "product updated successfully", updatedProduct)
    )
})