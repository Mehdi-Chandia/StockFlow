import mongoose from "mongoose";

type shipmentItemtype={
    productId: mongoose.Types.ObjectId,
    expectedQty: number,
    receivedQty: number,
    damagedQty: number,
    missingQty: number,
    note: string
}

interface IShipment{
    _id?: mongoose.Types.ObjectId,
    shipmentId: string,
    supplierId: mongoose.Types.ObjectId,
    purchaseOrderId: mongoose.Types.ObjectId,
    warehouseId: mongoose.Types.ObjectId,
    items: shipmentItemtype[],
    receivedBy: mongoose.Types.ObjectId,
    receivedAt: Date,
    createdAt?: Date,
    updatedAt?: Date,
}

const shipmentSchema= new mongoose.Schema<IShipment>({
    shipmentId:{
        type: String,
        required: true
    },
    purchaseOrderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PurchaseOrder",
        required: true
    },
    warehouseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WareHouse",
        required: true
    },
    supplierId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },
    receivedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items:[
        {
          productId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
          },
          expectedQty:{
            type: Number,
            required: true
          },
          receivedQty:{
            type: Number,
            required: true
          },
          damagedQty:{
            type: Number,
            required: true
          },
          missingQty:{
            type: Number,
            required: true
          },
          note:{
            type: String,
            required: true
          }
        }
    ],
    receivedAt:{
        type: Date,
        required: true
    }
})

const Shipment= mongoose.model<IShipment>("Shipment", shipmentSchema)
export default Shipment;