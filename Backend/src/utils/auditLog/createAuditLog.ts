import type mongoose from "mongoose";
import type { IAuditLog } from "../../models/auditLog.model.js";
import AuditLog from "../../models/auditLog.model.js";


export async function createAuditLog(data: IAuditLog, session?:mongoose.ClientSession){
    if (!data) {
        throw new Error("data not provided for audit log")
    }

    const auditLog= await AuditLog.create([{
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        performedBy: data.performedBy,
        reason: data.reason,
        ...(data.changes && {
            changes: data.changes
        })
    }], session ? {session} : undefined )

    if (!auditLog[0]) {
        throw new Error("error while creating audit log")
    }

    return auditLog[0];
}