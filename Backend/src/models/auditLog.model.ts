import mongoose from "mongoose";
import { AuditAction, AuditEntityType } from "../enums/auditLog.enum.js";

type auditChanges={
    old: unknown,
    new: unknown
}

export interface IAuditLog{
    _id?: mongoose.Types.ObjectId,
    action: AuditAction,
    entityType: AuditEntityType,
    entityId: mongoose.Types.ObjectId,
    performedBy: mongoose.Types.ObjectId,
    reason: string,
    changes?: Record<string, auditChanges>,
    createdAt?: Date,
    updatedAt?: Date

}

const auditLogSchema= new mongoose.Schema<IAuditLog>({
    action:{
        type: String,
        enum: Object.values(AuditAction),
        required: true
    },
    entityType:{
        type: String,
        enum: Object.values(AuditEntityType),
        required: true
    },
    entityId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    performedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reason:{
        type: String,
        required: true
    },
    changes: {
        type: mongoose.Schema.Types.Mixed
    }

})

auditLogSchema.index({
    entityType: 1,
    entityId: 1
});


const AuditLog= mongoose.model<IAuditLog>("AuditLog", auditLogSchema)
export default AuditLog;