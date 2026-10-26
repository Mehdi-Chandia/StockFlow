import type { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { productValidationSchema, updateProductValidationSchema } from "../validations/product.validaton.js";
import ApiError from "../utils/ApiError.js";
import { formatZodErrors } from "../utils/formatZodErrors.js";
import { UploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { generateProductSku } from "../utils/generateSKU.js";
import Product from "../models/product.model.js";
import { ProductStatus } from "../enums/product.enum.js";
import ApiResponse from "../utils/ApiResponse.js";
import { createAuditLog } from "../utils/auditLog/createAuditLog.js";
import { AuditEntityType } from "../enums/auditLog.enum.js";
import { AuditAction } from "../enums/auditLog.enum.js";
import { pagination } from "../utils/pagination.js";


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

         const allowedCategories= ["ELECTRONICS", "FURNITURE", "TOOLS", "HARDWARE", "ELECTRICAL"];
         if (!allowedCategories.includes(category)) {
            throw new ApiError(400, "invalid categorey type")
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
        sellPrice:sellPrice,
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

    const auditLogData= {
        action: AuditAction.CREATE,
        entityType: AuditEntityType.PRODUCT,
        entityId: newProduct._id,
        performedBy: req.user.id,
        reason: "product created"
    }

    await createAuditLog(auditLogData)

    return res.status(201).json(
        new ApiResponse(201, "Product created successfully", newProduct)
    )
})

// get all products
export const listProducts= AsyncHandler( async (req:Request, res:Response)=>{
    const {search, brand, category, status}=req.query;

    console.log("query params received ",search, brand, category, status );
    
    const {page, limit, skip}= pagination({Page: req.query.page?.toString(), Limit: req.query.limit?.toString()})
    
    if (status && !Object.values(ProductStatus).includes(status as ProductStatus) ) {
        throw new ApiError(400, "invalid status type")
    }

    const filter: Record<string, unknown>={}


   if (search) {
  const searchTerm = search.toString().trim();

  filter.$or = [
    { name: { $regex: searchTerm, $options: "i" } },
    { sku: { $regex: searchTerm, $options: "i" } },
  ];
}
    if (category) {
        filter.category=category;
    }
    if (status) {
        filter.status=status;
    }

    console.log(filter);
    

    const products= await Product.find(filter)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)

    // console.log("db call successfull", products);
    

//     if (products.length === 0) {
//          return res.status(200).json(
//         new ApiResponse(200, "no products found", [])
//     )
//   }
  

    const totalRecords= await Product.countDocuments(filter)
    const totalPages= Math.ceil(totalRecords/limit);
    const hasNextPage= page < totalPages;
    const hasPrevPage= page > 1;

     const data={
    products,
     pagination:{
      totalRecords,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage
    }
  }

    return res.status(200).json(
        new ApiResponse(200, products.length > 0 ? "products found" : "no products found", data)
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

    const auditLogData= {
        action: AuditAction.UPDATE,
        entityType: AuditEntityType.PRODUCT,
        entityId: product._id,
        performedBy: req.user.id,
        reason: "product status updated",
        changes: {
            status: {
                old: status === ProductStatus.ACTIVE ? ProductStatus.INACTIVE : ProductStatus.ACTIVE,
                new: status
            }
        }
    }

    await createAuditLog(auditLogData)

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

       const auditLogData= {
        action: AuditAction.UPDATE,
        entityType: AuditEntityType.PRODUCT,
        entityId: updatedProduct._id,
        performedBy: req.user.id,
        reason: "product updated "
    }

    await createAuditLog(auditLogData)

    return res.status(200).json(
        new ApiResponse(200, "product updated successfully", updatedProduct)
    )
})