import { StockMovementType } from "../../enums/stockMov.enums.js";
import type { IStockMovement } from "../../models/stockMovement.model.js";
import StockMovement from "../../models/stockMovement.model.js";


 async function createStockMovement (data: IStockMovement) {
    if (!data) {
        throw new Error("data not provided for stock movement! ")
    }

    let newStockMovement=null;

    if (data.type === StockMovementType.TRANSFER) {
          if (!data.fromWareHouseId || !data.toWareHouseId) {
            throw new Error("warehouse IDs not found")
         }
        newStockMovement= await StockMovement.create({
            productId: data.productId,
            type: data.type,
            movementQty: data.movementQty,
            fromWareHouseId: data.fromWareHouseId,
            toWareHouseId: data.toWareHouseId,
            quantityBefore: data.quantityBefore,
            quantityAfter: data.quantityAfter,
            reason: data.reason,
            performedBy: data.performedBy,
            refrenceType: data?.refrenceType || null,
            referenceId: data?.referenceId || null,

        })
    }else{
        newStockMovement= await StockMovement.create({
            productId: data.productId,
            type: data.type,
            movementQty: data.movementQty,
            warehouseId: data?.warehouseId,
            quantityBefore: data.quantityBefore,
            quantityAfter: data.quantityAfter,
            reason: data.reason,
            performedBy: data.performedBy,
            refrenceType: data?.refrenceType || null,
            referenceId: data?.referenceId || null,

        })        
    }

    return newStockMovement;
}

export default createStockMovement;