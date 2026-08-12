import mongoose from "mongoose";
import { WareHouseStatus } from "../enums/warehouse.enum.js";

interface IWareHouse{
    _id?: mongoose.Types.ObjectId,
    name: string,
    code: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    status:WareHouseStatus,
    manager: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date
}

const wareHouseSchema=new mongoose.Schema<IWareHouse>({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    code:{
         type: String,
        required: true  ,
        unique: true
    },
    phone:{
        type: String,
        required:true
    },
    address:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: Object.values(WareHouseStatus),
        required: true
    },
    manager:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true     
    }
},{timestamps: true})


const WareHouse= mongoose.model<IWareHouse>("WareHouse", wareHouseSchema)

export default WareHouse;