import api from "../../../services/api"
import type { CreateInventoryFormData } from "../schemas/inventory";
import type { AdjustmentType, InventoryFilters, InventoryStatus, StockMovementReason } from "../types/inventory";

// get all invventories handler
export const getInventories= async (page: number, limit: number, filters: InventoryFilters)=>{
    const response= await api.get("/inventory/list",{
        params:{
            page,
            limit,
            search: filters.search || undefined,
            status: filters.status
        }
    })
    console.log(response.data.data);
    
    return response.data.data;
}

// update inventory handler
export const updateInventoryStatus=async (status: InventoryStatus, inventoryId: string)=>{
    const response= await api.patch(`/inventory/${inventoryId}/status/update`, status)

    return response.data;
}

// get single inventory handler
export const getInventory= async(inventoryId: string)=>{
    const response= await api.get(`/inventory/${inventoryId}`)

    return response.data;
}


// adjust inventory handler
export const adjustInventory= async (inventoryId: string, data:{quantity: number, reason: StockMovementReason, type: AdjustmentType})=>{
    const response= await api.patch(`/inventory/${inventoryId}/adjust`, data)

    return response.data;
}

// create inventory handler
export const createInventory=async (data: CreateInventoryFormData)=>{
    const response= await api.post("/inventory/create", data)

    return response.data;
}
