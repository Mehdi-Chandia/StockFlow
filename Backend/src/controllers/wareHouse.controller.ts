import type { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { updateWHschema, WareHouseValidationSchema } from "../validations/wareHouse.validation.js";
import ApiError from "../utils/ApiError.js";
import WareHouse from "../models/wareHouse.model.js";
import { generateWHcode } from "../utils/generateWHcode.js";
import ApiResponse from "../utils/ApiResponse.js";
import { WareHouseStatus } from "../enums/warehouse.enum.js";
import { set } from "mongoose";
import { formatZodErrors } from "../utils/formatZodErrors.js";
import { createAuditLog } from "../utils/auditLog/createAuditLog.js";
import { AuditAction, AuditEntityType } from "../enums/auditLog.enum.js";


// create new WareHouse Handler

export const createWareHouse= AsyncHandler( async (req:Request, res:Response)=>{
    const {name, email, phone, address, manager, city}= req.body;
    const adminId= req.user?.id;

    const validation = WareHouseValidationSchema.
    safeParse({name, email, phone, address, manager, city})

    if (!validation.success) {
        const errors= formatZodErrors(validation.error)

        throw new ApiError(400, "validation failed", errors)
    }
    const prefix = generateWHcode(city);

    const count = await WareHouse.countDocuments({
    code: { $regex: `^${prefix}-` }
   });

    const code = `${prefix}-${count + 1}`;

    const alreadyRegistered= await WareHouse.findOne({
        $or:[
            {address: address},
            {code: code}
        ]
    })

    if (alreadyRegistered) {
        throw new ApiError(400, "warehouse already registered with given details")
    }

    const newWareHouse= await WareHouse.create({
        name,
        email,
        phone,
        address,
        code: code,
        city,
        status:WareHouseStatus.ACTIVE,
        manager,
        createdBy:adminId
    })

    const auditLogData={
        action: AuditAction.CREATE,
        entityType: AuditEntityType.WAREHOUSE,
        entityId: newWareHouse._id,
        performedBy: req.user?.id,
        reason: "warehouse created"
    }

    await createAuditLog(auditLogData)

    return res.status(201).json(
        new ApiResponse(200, "wareHouse registered successfully", newWareHouse)
    )


})

// get all wareHouses handler

export const getAllWareHouses= AsyncHandler( async (req: Request, res: Response)=>{

    const wareHouses= await WareHouse.find();

    if (!wareHouses) {
        throw new ApiError(404, "no warehouse found")        
    }

    return res.status(200).json(
        new ApiResponse(200, "wareHouses found ", wareHouses)
    )
})

//  get single wareHouse handler

export const getWareHouse= AsyncHandler( async (req: Request, res: Response)=>{
    const {wareHouseId} = req.params;
    if (!wareHouseId) {
        throw new ApiError(400, "no wareHoue ID found")
    }

    const wareHouse= await WareHouse.findById(wareHouseId);

    if (!wareHouse) {
        throw new ApiError(404, "no warehouse found")        
    }

    return res.status(200).json(
        new ApiResponse(200, "wareHouses found ", wareHouse)
    )
})

// status update handler

export const updateWHstatus= AsyncHandler( async (req:Request, res:Response)=>{
    const {status}= req.body;
    const {wareHouseId}= req.params;

    if (!wareHouseId) {
        throw new ApiError(400, "ID not found")
    }

    if (!status) {
        throw new ApiError(400, "missing status field")
    }

    if (!Object.values(WareHouseStatus).includes(status)) {
        throw new ApiError(400, "invalid status type")
    }

    const wareHoue= await WareHouse.findByIdAndUpdate(
        wareHouseId,
        {
            $set:{
                status: status
            }
        },
        
        {new: true}
    )

    if (!wareHoue) {
        throw new ApiError(404, "warehouse not found")
    }

    const auditLogData = {
        action: AuditAction.UPDATE,
        entityType: AuditEntityType.WAREHOUSE,
        entityId: wareHoue?._id,
        performedBy: req.user?.id,
        reason: `warehouse status updated to ${status}`
    }

    await createAuditLog(auditLogData);

    return res.status(200).json(
        new ApiResponse(200, "status updated successfully", null)
    )


})

// update wareHouse

export const updateWareHouse= AsyncHandler( async (req:Request, res:Response)=>{
    const {wareHouseId}= req.params;

    const validate= updateWHschema.safeParse(req.body)

    if (!validate.success) {
        const errors= formatZodErrors(validate.error)

        throw new ApiError(400, "validation failed", errors)
    }

    const updatedWarehouse= await WareHouse.findByIdAndUpdate(
        wareHouseId,
        {
            $set: validate.data
        },
        {new: true}
    )

    if (!updatedWarehouse) {
    throw new ApiError(404, "warehouse not found");
   }

   const auditLogData={
    action: AuditAction.UPDATE,
    entityType: AuditEntityType.WAREHOUSE,
    entityId: updatedWarehouse._id,
    performedBy: req.user?.id,
    reason: "warehouse details updated"
   }

   await createAuditLog(auditLogData);

   return res.status(200).json(
    new ApiResponse(200, "wareHouse updated successfully", null)
   )
})