import mongoose from "mongoose";


interface IRefreshSession{
    _id?: mongoose.Types.ObjectId,
    user:mongoose.Types.ObjectId,
    tokenHash: string,
    expiresAt: Date,
    revokedAt?: Date | null,
    jti: string,
    familyId: string
}

const refreshSessionSchema=new mongoose.Schema<IRefreshSession>({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    tokenHash:{
        type:String,
        required:true
    },
    expiresAt:{
        type: Date,
        required:true
    },
    revokedAt:{
        type:Date
    },
    jti:{
        type: String,
        unique: true
    },
    familyId:{
        type: String,
        required: true
    }
},{timestamps:true})

const RefreshSession= mongoose.model<IRefreshSession>("RefreshSession", refreshSessionSchema)

export default RefreshSession;